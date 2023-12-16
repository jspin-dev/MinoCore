import GameEvent from "./GameEvent"
import SideEffect from "./SideEffect"

export default interface CoreOperationResult<S> {
    state: S
    sideEffectRequests: SideEffect.Request[]
    events: GameEvent[]
}
