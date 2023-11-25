import Operation from "../../definitions/Operation";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";
import cancelAutoShift from "./cancelAutoShift";
import instantShift from "./instantShift";

let invertDirection = Operation.Provide(({ settings, meta }) => {
    let shouldInvertDirection = settings.dasInteruptionEnabled && meta.dasLeftCharged;
    let provideInstantShift = Operation.Provide(({ settings }) => Operation.applyIf(settings.arr === 0, instantShift));
    let setShiftDirectionLeft = Operation.Draft(draft => { draft.meta.direction = ShiftDirection.Left });
    let operation = Operation.Sequence(setShiftDirectionLeft, provideInstantShift);
    return Operation.applyIf(shouldInvertDirection, operation);
})

let conditionalCancelAutoShift = Operation.Provide(({ meta }) => {
    return Operation.applyIf(meta.direction == ShiftDirection.Right, cancelAutoShift)
})

export default Operation.SequenceStrict(
    Operation.Draft(draft => { draft.meta.dasRightCharged = false }),
    invertDirection, 
    conditionalCancelAutoShift
)