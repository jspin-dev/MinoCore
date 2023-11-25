import Operation from "../../definitions/Operation"
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions"

export default (arr: number) => Operation.Sequence(
    Operation.Draft(draft => { draft.settings.arr = arr }),
    Operation.Request(SideEffectRequest.TimerInterval(TimerName.AutoShift, arr))
)
