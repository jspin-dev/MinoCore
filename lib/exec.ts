import { Operation } from "./definitions/operationalDefinitions";
import { produce } from "immer";
import devSettings from "./devSettings.json";
import { GameStatus } from "./definitions/metaDefinitions";
import { State, Meta } from "./definitions/stateTypes";

export let execute = (state: State | null, operation: Operation.Any) => executeOperation(state || State.initial, operation)

let executeOperation = (state: State, operation: Operation.Any): State => {
    switch (operation.classifier) {
        case Operation.Classifier.Provider:
            return executeProvider(state, operation);
        case Operation.Classifier.Drafter:
            return executeDrafter(state, operation);
        case Operation.Classifier.Sequence:
            return executeSequencer(state, operation);
    }
}

let executeSequencer = (state: State, sequence: Operation.Sequencer): State => {
    return sequence.operations.reduce((current, operation) => executeOperation(current, operation), state);  
}

let executeDrafter = (state: State, drafter: Operation.Drafter): State => {
    if (!prechecksPass(state.meta, drafter)) {
        return state;
    }
    return produce(state, drafter.draft);
}

let executeProvider = (state: State, provider: Operation.Provider): State => {
    if (!prechecksPass(state.meta, provider)) {
        return state;
    }
    let operation = provider.provide(state);
    return executeOperation(state, operation);
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
        case Operation.Classifier.Sequence:
            return operation.operations.every(op => prechecksPass(meta, op));
    }
}
