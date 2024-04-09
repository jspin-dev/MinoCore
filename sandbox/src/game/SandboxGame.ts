import Input from "../../../build/definitions/Input"
import SideEffectRequest from "../../../build/core/definitions/SideEffectRequest"
import type Settings from "../../../build/settings/definitions/Settings"
import SandboxGameUtils from "./SandboxGameUtils"
import SandboxGameState from "./SandboxGameState"
import type CoreReducer from "../../../build/core/definitions/CoreReducer"

import defaultReducers from "../../../build/core/defaultCoreReducers"
import presetSchemas from "../../../build/presets/tetro/tetroSchemaPresets"
import addRns from "../../../build/core/reducers/root/addRns"
import startInput from "../../../build/core/reducers/root/lifecycle/startInput"
import endInput from "../../../build/core/reducers/root/lifecycle/endInput"
import initialize from "../../../build/core/reducers/root/lifecycle/initialize"
import start from "../../../build/core/reducers/root/lifecycle/start"
import { sequence } from "../../../build/util/reducerUtils"

const dependencies = { schema: presetSchemas.guideline, reducers: defaultReducers }
const initialRnsRequirement = dependencies.schema.pieceGenerator.rnsRequirement

export default class SandboxGame {

    state: SandboxGameState
    timers: Record<string, NodeJS.Timeout> = {}
    onStateChanged: (state: SandboxGameState) => void

    constructor(initialSettings: Settings) {
        this.state = SandboxGameState.initial(initialSettings, dependencies)
    }

    run(rootReducer: CoreReducer) {
        const initialResult = { state: this.state.core, sideEffectRequests: [], events: [], logs: [] }
        const { state, sideEffectRequests } = rootReducer(initialResult, dependencies)
        this.state.core = state
        sideEffectRequests.forEach(request => this.executeSideEffect(request))
        this.onStateChanged?.(this.state)
        console.log(state)
    }

    executeSideEffect(request: SideEffectRequest) {
        switch (request.classifier) {
            case SideEffectRequest.Classifier.StartTimer:
                clearTimeout(this.timers[request.timerName])
                this.timers[request.timerName] = setTimeout(() => this.run(request.postDelayOp), request.delay)
                break
            case SideEffectRequest.Classifier.CancelTimer:
                clearTimeout(this.timers[request.timerName])
                break
            case SideEffectRequest.Classifier.Rng:
                this.run(addRns(SandboxGameUtils.generateRns(request.quantity)))
        }
    }

    startInput(input: Input) {
        if (!input) { return }
        switch (input.classifier) {
            case Input.Classifier.ActiveGame:
                this.run(startInput(input.input))
                break
            case Input.Classifier.Lifecycle:
                switch (input.input) {
                    case Input.Lifecycle.Restart:
                        this.restart()
                        break
                    // case Input.Lifecycle.Pause:
                    //     this.run(togglePause)
                }
        }
    }

    endInput(input: Input) {
        if (input && input.classifier === Input.Classifier.ActiveGame) {
            this.run(endInput(input.input))
        }
    }

    initialize() {
        const rns = SandboxGameUtils.generateRns(initialRnsRequirement)
        this.run(initialize(rns))
    }

    restart() {
        Object.values(this.timers).forEach(timer => clearTimeout(timer))
        this.state = SandboxGameState.initial(this.state.core.settings, dependencies)
        const rns = SandboxGameUtils.generateRns(initialRnsRequirement)
        this.run(sequence(initialize(rns), start))
    }

}
