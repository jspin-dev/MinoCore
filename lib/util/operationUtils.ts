import Log from "../definitions/Log"
import Operation from "../definitions/Operation"
import LogTracker from "../definitions/LogTracker"
import Precondition from "../definitions/Precondition"

/**
 * Maps an array of operations to a single operation
 * @param operations Operations to be executed sequentially
 */
export const sequence = <S, D>(...operations: Operation<S, D>[]) => (previousState: S, dependencies: D) => {
    return operations.reduce((state, operation) => {
        return { ...state, ...operation(state, dependencies) }
    }, previousState)
}

/**
 * Applies the provided operation only if the condition is true. Unlike [withPrecondition], failure to meet the
 * condition is not considered an error
 */
export const withCondition = <S, D>(operation: Operation<S, D>, condition: boolean): Operation<S, D> => {
    return condition ? operation : passthroughOperation
}

/**
 * Maps to a new operation when provided operation input parameters
 * @param getOperation Mapping function which returns a different operation instead of a new state
 */
export const mapOperation = <S, D>(getOperation: (previousState: S, dependencies: D) => Operation<S, D>) => {
    return (previousResult: S, dependencies: D) => {
        const operation = getOperation(previousResult, dependencies)
        return operation(previousResult, dependencies)
    }
}

/**
 * Shorthand for a "do nothing" operation where the state does not change
 */
export const passthroughOperation = () => { return {} }

/**
 * Applies the provided operations only if all preconditions are true. See [withPrecondition]
 * @param params
 */
export const withPreconditions = <S extends LogTracker, D>(
    params: { operationName: string, preconditions: Precondition<S>[], operation: Operation<S, D> }
) => (previousState: S, dependencies: D) => {
    return params.operation(previousState, dependencies)
    // return params.preconditions.reduce((currentState, precondition) => {
    //     const preconditionedReducer = withPrecondition({
    //         reducerName: params.reducerName,
    //         precondition,
    //         reduce: params.reduce
    //     })
    //     return preconditionedReducer(currentState, dependencies)
    // }, previousState)
}

/**
 * Applies the provided operations only if the precondition is true. Otherwise, it will log an error with a rationale for
 * the precondition failure
 * @param params
 */
export const withPrecondition = <S extends LogTracker, D>(
    params: {  operationName: string, precondition: Precondition<S>, operation: Operation<S, D> }
) => (previousState: S, dependencies: D) => {
    if (!params.precondition.isValid(previousState)) {
        const log = { level: Log.Level.Error, message: params.precondition.rationale(params.operationName) }
        return { ...previousState, logs: [ ...previousState.logs, log ] }
    }
    return params.operation(previousState, dependencies)
}
