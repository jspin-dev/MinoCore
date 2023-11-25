import Operation from "../../definitions/Operation";
import { TimerName, TimerOperation } from "../../definitions/metaDefinitions";

export default Operation.Sequence(
    Operation.RequestTimerOp(TimerName.DAS, TimerOperation.Cancel),
    Operation.RequestTimerOp(TimerName.AutoShift, TimerOperation.Cancel)
)
