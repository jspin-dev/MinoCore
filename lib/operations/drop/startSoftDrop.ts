import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import recordStep from "../statistics/recordStep";
import drop from "./drop";
import instantDrop from "./instantDrop";

let autoOrInstantDrop = Operation.Provide(({ settings }) => {
    let autoDrop = Operation.Request(SideEffectRequest.TimerInterval(TimerName.AutoDrop, settings.softDropInterval))
    return settings.softDropInterval == 0 ? instantDrop(DropScoreType.Soft) : autoDrop;
})

export default Operation.SequenceStrict(
    drop(1, DropScoreType.Soft), 
    recordStep(MovementType.Drop),
    Operation.Draft(draft => { draft.meta.softDropActive = true }),
    autoOrInstantDrop
)