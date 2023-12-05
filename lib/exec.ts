import Operation from "./definitions/Operation";
import { produce } from "immer";

export function execute<S, D, R>(
    initialResult: R,
    depencencies: D,
    rootOperation: Operation<S, D, R>
): R {
    return executeOperation(initialResult, depencencies, rootOperation);
}

function executeOperation<S, D, R>(
    cumulativeResult: R, 
    depencencies: D,
    operation: Operation<S, D, R>
): R {
    switch (operation.classifier) {
        case Operation.Classifier.Provider:
            return executeProvider(cumulativeResult, depencencies, operation)
        case Operation.Classifier.Drafter:
            return executeDrafter(cumulativeResult, operation);
        case Operation.Classifier.Sequencer:
            return executeSequencer(cumulativeResult, depencencies, operation);
    }
}

function executeSequencer<S, D, R>(
    cumulativeResult: R, 
    depencencies: D,
    sequence: Operation.Sequencer<S, D, R>
): R {
    return sequence.operations.reduce((current, operation) => executeOperation(
        current, 
        depencencies,
        operation
    ), cumulativeResult);  
}

function executeDrafter<R>(
    cumulativeResult: R, 
    drafter: Operation.Drafter<R>
): R {
    return produce(cumulativeResult, drafter.draft);
}

function executeProvider<S, D, R>(
    cumulativeResult: R, 
    depencencies: D,
    provider: Operation.Provider<S, D, R>
): R {
    let operation = provider.provide(cumulativeResult, depencencies);
    return executeOperation(cumulativeResult, depencencies, operation);
}
