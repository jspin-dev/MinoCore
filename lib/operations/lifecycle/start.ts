import Operation from "../../definitions/Operation";
import { GameStatus, TimerName, TimerOperation } from "../../definitions/metaDefinitions";
import next from "../next/next";
import updateStatus from "./updateStatus";

export default Operation.Sequence(
    next,
    updateStatus(GameStatus.Active),
    Operation.RequestTimerOp(TimerName.Clock, TimerOperation.Start),
    Operation.RequestTimerOp(TimerName.AutoDrop, TimerOperation.Start)
)