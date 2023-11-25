import Operation from "./definitions/Operation";
import { produce } from "immer";
import devSettings from "./devSettings.json";
import { GameStatus, SideEffectRequest, } from "./definitions/metaDefinitions";
import { State, Meta, Dependencies } from "./definitions/stateTypes";

type OperationResult = {
    state: State,
    sideEffectRequests: SideEffectRequest.Any[]
}

export let execute = (
    state: State | null, 
    depencencies: Dependencies,
    rootOperation: Operation.Any
): OperationResult => {
    let initialResult: OperationResult = {
        state: state || State.initial,
        sideEffectRequests: []
    }
    return executeOperation(initialResult, depencencies, rootOperation);
}

let executeOperation = (
    cumulativeResult: OperationResult, 
    depencencies: Dependencies,
    operation: Operation.Any
): OperationResult => {
    switch (operation.classifier) {
        case Operation.Classifier.Provider:
            return executeProvider(cumulativeResult, depencencies, operation)
        case Operation.Classifier.Drafter:
            return executeDrafter(cumulativeResult, operation);
        case Operation.Classifier.Sequencer:
            return executeSequencer(cumulativeResult, depencencies, operation);
        case Operation.Classifier.Requester:
            return executeRequester(cumulativeResult, operation);
    }
}

let executeSequencer = (
    cumulativeResult: OperationResult, 
    depencencies: Dependencies,
    sequence: Operation.Sequencer
): OperationResult => {
    return sequence.operations.reduce((current, operation) => executeOperation(
        current, 
        depencencies,
        operation
    ), cumulativeResult);  
}

let executeDrafter = (cumulativeResult: OperationResult, drafter: Operation.Drafter): OperationResult => {
    if (!prechecksPass(cumulativeResult.state.meta, drafter)) {
        return cumulativeResult;
    }
    return {
        ...cumulativeResult,
        state: produce(cumulativeResult.state, drafter.draft),
    }
}

let executeProvider = (
    cumulativeResult: OperationResult, 
    depencencies: Dependencies,
    provider: Operation.Provider
): OperationResult => {
    if (!prechecksPass(cumulativeResult.state.meta, provider)) {
        return cumulativeResult;
    }
    let operation = provider.provide(cumulativeResult.state, depencencies);
    return executeOperation(cumulativeResult, depencencies, operation);
}

let executeRequester = (cumulativeResult: OperationResult, requester: Operation.Requester): OperationResult => {
    return {
        ...cumulativeResult,
        sideEffectRequests: [...cumulativeResult.sideEffectRequests, requester.request]
    }
}

// Returns false if this operation is not allowed
let prechecksPass = (meta: Meta, operation: Operation.Any): boolean => {
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
