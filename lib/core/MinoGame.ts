import CoreState from "./definitions/CoreState"
import CoreOperations from "./definitions/CoreOperations"
import CoreDependencies from "./definitions/CoreDependencies"
import CoreOperationResult from "./definitions/CoreOperationResult"
import GameSchema from "../schema/definitions/GameSchema"
import Settings from "../settings/definitions/Settings"
import Input from "../definitions/Input"
import CoreOperation from "./definitions/CoreOperation"
import DeferredAction from "./definitions/DeferredAction"
import CoreResult from "./definitions/CoreResult"
import { updateCoreState } from "./utils/coreOperationUtils"
import buildSchema from "../schema/buildSchema"
import StateMapper from "../definitions/StateMapper"

// noinspection JSUnusedGlobalSymbols
class MinoGame<S extends { core: CoreState }> {

    state: S
    onStateChanged: (state: S) => void
    timers: Record<string, NodeJS.Timeout> = {}
    operations: CoreOperations<CoreState, CoreDependencies, CoreOperationResult<CoreState>>
    schema: GameSchema
    stateMapper: StateMapper<CoreState, CoreResult, S>

    constructor(config: MinoGame.Config<S>, onStateChanged: (state: S) => void) {
        this.operations = config.operations
        this.schema = buildSchema(config.schema)
        this.stateMapper = config.stateMapper
        const initialCoreState = CoreState.initial(config.initialSettings, this.schema, this.generateRns())
        this.state = config.stateMapper.initialize(initialCoreState)
        this.onStateChanged = onStateChanged
        this.run(this.operations.initialize)
    }

    start() {
        this.run(this.operations.start)
    }

    getInitialCoreState(initialSettings: Settings) {
        return CoreState.initial(initialSettings, this.schema, this.generateRns())
    }

    updateSettings(settings: Settings) {
        this.run(updateCoreState({ settings }))
    }

    startInput(input: Input) {
        if (!input) { return }
        switch (input.classifier) {
            case Input.Classifier.ActiveGame:
                this.run(this.operations.startInput(input.input))
                break
            case Input.Classifier.Restart:
                this.run(this.operations.restart(this.generateRns()))
                break
            case Input.Classifier.Pause:
            //this.run(togglePause)
        }
    }

    endInput(input: Input) {
        if (input && input.classifier === Input.Classifier.ActiveGame) {
            this.run(this.operations.endInput(input.input))
        }
    }

    private run(operation: CoreOperation) {
        const dependencies = { operations: this.operations, schema: this.schema }
        let initialResult = CoreResult.initFromCoreState(this.state.core)
        const result = { ...initialResult, ...operation(initialResult, dependencies) }
        this.state = this.stateMapper.mapFromResult(this.state, result)
        this.onStateChanged(this.state)
        result.deferredActions.forEach(request => this.executeDeferredAction(request))
    }

    private executeDeferredAction(deferredAction: DeferredAction) {
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
                let rns = this.generateRns(deferredAction.quantity)
                this.run(deferredAction.operation(rns))
        }
    }

    private generateRns(quantity: number = this.schema.pieceGenerator.rnsRequirement) {
        return Array.from(Array(quantity)).map(() => Math.random())
    }

}

namespace MinoGame {

    export interface Config<S> {
        initialSettings: Settings,
        schema: GameSchema.Basis,
        operations: CoreOperations<CoreState, CoreDependencies, CoreOperationResult<CoreState>>,
        stateMapper: StateMapper<CoreState, CoreResult, S>
    }

    export namespace Config {

        // noinspection JSUnusedGlobalSymbols
        export const defaults = {
            operations: CoreOperations.defaults,
            stateMapper: StateMapper.coreDefault
        }

    }

}

// noinspection JSUnusedGlobalSymbols
export default MinoGame