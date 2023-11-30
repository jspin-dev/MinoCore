import Operation from "./definitions/Operation";
import { produce } from "immer";
import devSettings from "./devSettings.json";
import { GameStatus, SideEffectRequest, } from "./definitions/metaDefinitions";
import { State, Meta } from "./definitions/stateTypes";
import Dependencies from "./definitions/Dependencies";
import GameEvent from "./definitions/GameEvent";

export type OperationResult<S extends State> = {
    state: S,
    sideEffectRequests: SideEffectRequest.Any[],
    events: GameEvent[]
}

export function execute<S extends State, D extends Dependencies<S>>(
    state: S | null,
    initialState: S,
    depencencies: D,
    rootOperation: Operation<S>
): OperationResult<S> {
    let initialResult: OperationResult<S> = {
        state: state || initialState,
        sideEffectRequests: [],
        events: []
    }
    return executeOperation(initialResult, depencencies, rootOperation);
}

function executeOperation<S extends State, D extends Dependencies<S>>(
    cumulativeResult: OperationResult<S>, 
    depencencies: D,
    operation: Operation<S>
): OperationResult<S> {
    switch (operation.classifier) {
        case Operation.Classifier.Provider:
            return executeProvider(cumulativeResult, depencencies, operation)
        case Operation.Classifier.Drafter:
            return executeDrafter(cumulativeResult, operation);
        case Operation.Classifier.Sequencer:
            return executeSequencer(cumulativeResult, depencencies, operation);
    }
}

function executeSequencer<S extends State, D extends Dependencies<S>>(
    cumulativeResult: OperationResult<S>, 
    depencencies: D,
    sequence: Operation.Sequencer<S>
): OperationResult<S> {
    return sequence.operations.reduce((current, operation) => executeOperation(
        current, 
        depencencies,
        operation
    ), cumulativeResult);  
}

function executeDrafter<S extends State>(
    cumulativeResult: OperationResult<S>, 
    drafter: Operation.Drafter<S>
): OperationResult<S> {
    if (!prechecksPass(cumulativeResult.state.meta, drafter)) {
        return cumulativeResult;
    }
    return produce(cumulativeResult, drafter.draft);
}

function executeProvider<S extends State, D extends Dependencies<S>>(
    cumulativeResult: OperationResult<S>, 
    depencencies: D,
    provider: Operation.Provider<S>
): OperationResult<S> {
    if (!prechecksPass(cumulativeResult.state.meta, provider)) {
        return cumulativeResult;
    }
    let operation = provider.provide(cumulativeResult, depencencies);
    return executeOperation(cumulativeResult, depencencies, operation);
}

// Returns false if this operation is not allowed
let prechecksPass = <S extends State>(meta: Meta, operation: Operation<S>): boolean => {
    if (operation == null) {
        throw "Undefined operation, ignoring";
    }
    switch (operation.classifier) {
        case Operation.Classifier.Provider:
        case Operation.Classifier.Drafter:
            if (devSettings.verboseLog && operation.args?.description) {
                console.log(operation.args.description);
            }
            let gameInactive = meta && meta.status != GameStatus.Active;
            return !gameInactive || !operation.args?.strict;
        case Operation.Classifier.Sequencer:
            return operation.operations.every(op => prechecksPass(meta, op));
    }
}
