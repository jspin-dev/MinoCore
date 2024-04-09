import CoreState from "../definitions/CoreState"
import CoreResult from "../definitions/CoreResult"
import CoreReducerResult from "../definitions/CoreReducerResult"
import SideEffectRequest from "../definitions/SideEffectRequest"
import CoreDependencies from "../definitions/CoreDependencies"
import CoreReducers from "../definitions/CoreReducers"
import CoreReducer from "../definitions/CoreReducer"
import GameEvent from "../../definitions/GameEvent"
import Reducer from "../../definitions/Reducer"
import TimerName from "../definitions/TimerName"
import { mapReducer, sequence } from "../../util/reducerUtils"

export const updateState = <S extends CoreState>(state: Partial<S>) => (result: CoreResult) => {
    return { ...result, state: { ...result.state, ...state } }
}

export const createStateReducer = <R extends Readonly<CoreReducerResult<S>>, S extends CoreState, D>(
    execute: (previousState: S, dependencies: D) => Partial<S>
) => (previousResult: R, dependencies: D) => {
    return {
        ...previousResult,
        state: { ...previousResult.state, ...execute(previousResult.state, dependencies) }
    }
}

export const addSideEffectRequest = <R extends Readonly<CoreReducerResult<S>>, S extends CoreState>(
    sideEffectRequest: SideEffectRequest
) => (previousResult: R) => {
    return {
        ...previousResult,
        sideEffectRequests: [...previousResult.sideEffectRequests, sideEffectRequest]
    }
}

export const provideReducers = (reducerProvider: ReducerProvider) => {
    return mapReducer((_: CoreResult, { reducers }: CoreDependencies) =>  reducerProvider(reducers))
}

type ReducerProvider = <R extends Readonly<CoreReducerResult<S>>, S extends CoreState, D extends CoreDependencies>(
    reducers: CoreReducers<S, D, R>
) => CoreReducer

export const addEvent = <R extends Readonly<CoreReducerResult<S>>, S extends CoreState, D>(
    event: GameEvent
): Reducer<R, D> => (previousResult: R) => {
    return {
        ...previousResult,
        events: [...previousResult.events, event]
    }
}

export const cancelTimer = <R extends Readonly<CoreReducerResult<S>>, S extends CoreState, D>(
    timerName: TimerName
): Reducer<R, D> => addSideEffectRequest(SideEffectRequest.CancelTimer({ timerName }))

export const cancelTimers = <R extends Readonly<CoreReducerResult<S>>, S extends CoreState, D>(
    ... timers: TimerName[]
): Reducer<R, D> => {
    const reducers: Reducer<R, D>[] = timers.map(timerName => cancelTimer(timerName))
    return sequence(...reducers)
}

export const cancelAllTimers = sequence(
    cancelTimer(TimerName.DropLock),
    cancelTimer(TimerName.DAS),
    cancelTimer(TimerName.Drop),
    cancelTimer(TimerName.Clock),
    cancelTimer(TimerName.AutoShift)
)
