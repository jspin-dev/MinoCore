import type GameEvent from "../../definitions/GameEvent"
import type SideEffectRequest from "./SideEffectRequest"

export default interface CoreOperationResult<S> {
    state: S
    sideEffectRequests: SideEffectRequest[]
    events: GameEvent[]
}
