import type GameEvent from "../../definitions/GameEvent"
import type DeferredAction from "./DeferredAction"
import LogTracker from "../../definitions/LogTracker"

export default interface CoreOperationResult<S> extends LogTracker {
    state: S
    deferredActions: DeferredAction[]
    events: GameEvent[]
}
