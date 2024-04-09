import Log from "../definitions/Log"
import Reducer from "../definitions/Reducer"
import LogTracker from "../definitions/LogTracker"
import Precondition from "../definitions/Precondition"

/**
 * Maps a list of reducers which must be executed sequentially to a single reducer
 * @param reducers
 */
export const sequence = <S, D>(...reducers: Reducer<S, D>[]) => {
    return  (previousState: S, dependencies: D) => {
        return reducers.reduce((state, reduce) => {
            return { ...state, ...reduce(state, dependencies) }
        }, previousState)
    }
}

/**
 * Applies the provided reducer only if the condition is true. Failure to meet the condition is not considered an error
 */
export const withCondition = <S, D>(reducer: Reducer<S, D>, condition: boolean): Reducer<S, D> => {
    return condition ? reducer : passthroughReducer
}

export const mapReducer = <S, D>(getReducer: (previousState: S, dependencies: D) => Reducer<S, D>) => {
    return (previousResult: S, dependencies: D) => {
        const reduce = getReducer(previousResult, dependencies)
        return reduce(previousResult, dependencies)
    }
}

export const passthroughReducer = () => { return {} }



/**
 * Applies the provided reducer only if all preconditions are true. See [withPrecondition]
 * @param params
 */
export const withPreconditions = <S extends LogTracker, D>(
    params: { reducerName: string, preconditions: Precondition<S>[], reduce: Reducer<S, D> }
) => (previousState: S, dependencies: D) => {
    return params.reduce(previousState, dependencies)
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
 * Applies the provided reducer only if the precondition is true. Otherwise, it will log an error with a rationale for
 * the precondition failure
 * @param params
 */
export const withPrecondition = <S extends LogTracker, D>(
    params: {  reducerName: string, precondition: Precondition<S>, reduce: Reducer<S, D> }
) => (previousState: S, dependencies: D) => {
    if (!params.precondition.isValid(previousState)) {
        const log = { level: Log.Level.Error, message: params.precondition.rationale(params.reducerName) }
        return { ...previousState, logs: [ ...previousState.logs, log ] }
    }
    return params.reduce(previousState, dependencies)
}
