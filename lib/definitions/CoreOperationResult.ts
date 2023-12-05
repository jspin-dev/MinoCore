import GameEvent from "./GameEvent"
import { SideEffectRequest } from "./metaDefinitions"

export interface CoreOperationResult<S> {
    state: S
    sideEffectRequests: SideEffectRequest.Any[]
    events: GameEvent[]
}
