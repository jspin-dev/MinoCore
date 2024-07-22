import CoreState from "../definitions/CoreState"
import CoreResult from "../definitions/CoreResult"
import CoreOperationResult from "../definitions/CoreOperationResult"
import DeferredAction from "../definitions/DeferredAction"
import CoreDependencies from "../definitions/CoreDependencies"
import CoreOperations from "../definitions/CoreOperations"
import CoreOperation from "../definitions/CoreOperation"
import GameEvent from "../../definitions/GameEvent"
import Operation from "../../definitions/Operation"
import TimerName from "../definitions/TimerName"
import { mapOperation } from "../../util/operationUtils"

/**
 * Returns an operation which modifies only the state portion of a result given a partial state. This is useful
 * for simple state modifications. Unlike [mapCoreState] it provides no mechanism to reference the current state
 * @param state Partial state with the desired changes
 */
export const updateCoreState = <S extends CoreState>(state: Partial<S>) => (result: CoreResult) => {
    return { ...result, state: { ...result.state, ...state } }
}

/**
 * Returns an operation which maps only the core state within a CoreOperationResult. This is useful if you only need
 * to change the state, but not other parts of the result
 * @param execute
 */
export const mapCoreState = <R extends Readonly<CoreOperationResult<S>>, S extends CoreState, D>(
    execute: (previousState: S, dependencies: D) => Partial<S>
) => (previousResult: R, dependencies: D) => {
    return {
        ...previousResult,
        state: { ...previousResult.state, ...execute(previousResult.state, dependencies) }
    }
}

const addDeferredActions = <R extends Readonly<CoreOperationResult<S>>, S extends CoreState>(
    ...deferredActions: DeferredAction[]
) => (previousResult: R) => {
    return {
        ...previousResult,
        deferredActions: [...previousResult.deferredActions, ...deferredActions]
    }
}

export const delayOperation = (params: DeferredAction.DelayOperation.Params) => {
    return addDeferredActions(DeferredAction.DelayOperation(params))
}

export const cancelPendingOperation = (timerName: TimerName) => {
    return cancelPendingOperations(timerName)
}

export const cancelPendingOperations = <R extends Readonly<CoreOperationResult<S>>, S extends CoreState, D>(
    ...timers: TimerName[]
): Operation<R, D> => addDeferredActions(...timers.map(timer => DeferredAction.CancelOperation(timer)))

/**
 * Returns a new operation based one or more existing operations. It does not provide the current result or
 * any dependencies besides the available operations
 * @param operationProvider
 */
export const mapFromOperations = (operationProvider: OperationProvider) => {
    return mapOperation((_: CoreResult, { operations }: CoreDependencies) =>  operationProvider(operations))
}
type OperationProvider = <R extends Readonly<CoreOperationResult<S>>, S extends CoreState, D extends CoreDependencies>(
    operations: CoreOperations<S, D, R>
) => CoreOperation

export const mapFromDependencies = (dependencyProvider: (dependencies: CoreDependencies) => CoreOperation) => {
    return mapOperation((_: CoreResult, dependencies: CoreDependencies) =>  dependencyProvider(dependencies))
}

export const addEvent = <R extends Readonly<CoreOperationResult<S>>, S extends CoreState, D>(
    event: GameEvent
): Operation<R, D> => (previousResult: R) => {
    return {
        ...previousResult,
        events: [...previousResult.events, event]
    }
}

export const cancelAllPendingOperations = cancelPendingOperations(
    TimerName.DropLock,
    TimerName.DAS,
    TimerName.Drop,
    TimerName.AutoShift,
    TimerName.Clock
)
