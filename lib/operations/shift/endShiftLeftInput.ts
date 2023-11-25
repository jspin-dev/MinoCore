import Operation from "../../definitions/Operation";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";
import cancelAutoShift from "./cancelAutoShift";
import instantShift from "./instantShift";

let invertDirection = Operation.Provide(({ settings, meta }) => {
    let shouldInvertDirection = settings.dasInteruptionEnabled && meta.dasRightCharged;
    let provideInstantShift = Operation.Provide(({ settings }) => Operation.applyIf(settings.arr === 0, instantShift));
    let setShiftDirectionRight = Operation.Draft(draft => { draft.meta.direction = ShiftDirection.Right });
    let operation = Operation.Sequence(setShiftDirectionRight, provideInstantShift)
    return Operation.applyIf(shouldInvertDirection, operation);
})

let conditionalCancelAutoShift = Operation.Provide(({ meta }) => {
    return Operation.applyIf(meta.direction == ShiftDirection.Left, cancelAutoShift)
})

export default Operation.SequenceStrict(
    Operation.Draft(draft => { draft.meta.dasLeftCharged = false }), 
    invertDirection,
    conditionalCancelAutoShift
)