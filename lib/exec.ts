import { isProvider, isDrafter, isOperation, isOperationList } from "./definitions/operationalDefinitions";
import { produce } from "immer";
import devSettings from "./devSettings.json";
import { GameStatus } from "./definitions/metaDefinitions";
import { State, Meta } from "./types/stateTypes";

export function execute(initialState: State, ...operations: Operation[]): State {
    let checkedInitialState = initialState || {
        playfield: null,
        hold: null,
        preview: null,
        meta: null,
        settings: null,
        statistics: null
    }
    return operations.reduce((state, operation) => {
        if (isProvider(operation)) {
            return executeProvider(state, operation);
        } else if (isDrafter(operation)) {
            return executeDrafter(state, operation);
        } else {
            throw "Unexpected operation type";
        }
    }, checkedInitialState);  
}

export function executeDrafter(state: State, drafter: Drafter): State {
    if (!performOperationPrechecks(state.meta, drafter)) {
        return state;
    }
    return produce(state, drafter.draft);
}

export function executeProvider(state: State, provider: Provider): State {
    if (!performOperationPrechecks(state.meta, provider)) {
        return state;
    }
    let actionable = provider.provide(state);
    if (isOperationList(actionable)) {
        return execute(state, ...actionable);
    } else if (isOperation(actionable)) {
        return execute(state, actionable);
    } else {
        throw "Unexpected actionable type";
    }
}

// Returns false if this operation is not allowed
let performOperationPrechecks = (meta: Meta, operation: Operation): boolean => {
    if (operation == null) {
        throw "Unable to execute a null operation";
    }
    if (devSettings.verboseLog && operation.log) {
        console.log(operation.log);
    }
    let gameInactive = meta && meta.status != GameStatus.Active;
    return !gameInactive || !operation.requiresActiveGame;
}

