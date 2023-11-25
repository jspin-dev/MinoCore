import Operation from "../../definitions/Operation"
import { SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions"

export default (das: number) => Operation.Sequence(
    Operation.Draft(draft => { draft.settings.das = das }),
    Operation.Request(SideEffectRequest.TimerInterval(TimerName.DAS, das))
)