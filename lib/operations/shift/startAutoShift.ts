import Operation from "../../definitions/Operation";
import { TimerName, TimerOperation } from "../../definitions/metaDefinitions";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";
import instantShift from "./instantShift";

let charge = Operation.Provide(({ meta }) => {
    if (meta.direction == ShiftDirection.Right) {
        return Operation.Draft(draft => { draft.meta.dasRightCharged = true });
    } else if (meta.direction == ShiftDirection.Left) {
        return Operation.Draft(draft => { draft.meta.dasLeftCharged = true });
    } else {
        return Operation.None;
    }
})

let requestStartAutoShiftTimer = Operation.RequestTimerOp(TimerName.AutoShift, TimerOperation.Start)

let conditionalShift = Operation.Provide (({ settings }) => {
    return settings.arr == 0 ? instantShift : requestStartAutoShiftTimer
})

export default Operation.SequenceStrict(charge, conditionalShift)