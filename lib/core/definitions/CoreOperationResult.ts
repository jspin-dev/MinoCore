import type GameEvent from "../../definitions/GameEvent"
import type SideEffect from "./SideEffect"

export default interface CoreOperationResult<S> {
    state: S
    sideEffectRequests: SideEffect.Request[]
    events: GameEvent[]
}
