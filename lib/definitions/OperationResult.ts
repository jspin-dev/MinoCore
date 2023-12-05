import GameEvent from "./GameEvent"
import { SideEffectRequest } from "./metaDefinitions"

export type OperationResult<T> = {
    state: T,
    sideEffectRequests: SideEffectRequest.Any[],
    events: GameEvent[]
}
