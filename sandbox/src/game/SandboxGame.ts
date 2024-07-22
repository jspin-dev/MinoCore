import Input from "../../../build/definitions/Input"
import type Settings from "../../../build/settings/definitions/Settings"
import SandboxGameUtils from "./SandboxGameUtils"
import SandboxGameState from "./SandboxGameState"
import DeferredAction from "../../../build/core/definitions/DeferredAction"
import type CoreOperation from "../../../build/core/definitions/CoreOperation"
import defaultOperations from "../../../build/core/defaultCoreOperations"
import presetSchemas from "../../../build/presets/tetro/tetroSchemaPresets"
import startInput from "../../../build/core/operations/lifecycle/startInput"
import endInput from "../../../build/core/operations/lifecycle/endInput"
import initialize from "../../../build/core/operations/lifecycle/initialize"
import start from "../../../build/core/operations/lifecycle/start"
import { sequence } from "../../../build/util/operationUtils"

const dependencies = { schema: presetSchemas.guideline, operations: defaultOperations }
const initialRnsRequirement = dependencies.schema.pieceGenerator.rnsRequirement

export default class SandboxGame {

    state: SandboxGameState
    timers: Record<string, NodeJS.Timeout> = {}
    onStateChanged: (state: SandboxGameState) => void

    constructor(initialSettings: Settings) {
        this.state = SandboxGameState.initial(initialSettings, dependencies)
    }

    run(rootReducer: CoreOperation) {
        const initialResult = {
            state: this.state.core,
            deferredActions: [],
            events: [],
            logs: []
        }
        const { state, deferredActions } = rootReducer(initialResult, dependencies)
        this.state.core = state
        deferredActions.forEach(request => this.executeDeferredAction(request))
        this.onStateChanged?.(this.state)
    }

    executeDeferredAction(deferredAction: DeferredAction) {
        switch (deferredAction.classifier) {
            case DeferredAction.Classifier.DelayOperation:
                clearTimeout(this.timers[deferredAction.timerName])
                this.timers[deferredAction.timerName] = setTimeout(
                    () => this.run(deferredAction.operation),
                    deferredAction.delayInMillis
                )
                break
            case DeferredAction.Classifier.CancelOperation:
                clearTimeout(this.timers[deferredAction.timerName])
                break
            case DeferredAction.Classifier.AddRns:
                let rns = SandboxGameUtils.generateRns(deferredAction.quantity)
                this.run(deferredAction.operation(rns))
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
