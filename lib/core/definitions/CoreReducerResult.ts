import type GameEvent from "../../definitions/GameEvent"
import type SideEffectRequest from "./SideEffectRequest"
import LogTracker from "../../definitions/LogTracker"

export default interface CoreReducerResult<S> extends LogTracker {
    state: S
    sideEffectRequests: SideEffectRequest[]
    events: GameEvent[]
}
