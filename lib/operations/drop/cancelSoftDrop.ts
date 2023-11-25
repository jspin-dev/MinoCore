import Operation from "../../definitions/Operation";
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions";

export default Operation.Provide(({ settings }) => Operation.Sequence(
    Operation.Request(SideEffectRequest.TimerInterval(TimerName.AutoDrop, settings.dropInterval)),
    Operation.Draft(draft => { draft.meta.softDropActive = false })
))