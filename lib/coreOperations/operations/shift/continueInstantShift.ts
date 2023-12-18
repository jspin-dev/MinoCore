import Operation from "../../definitions/CoreOperation";
import ShiftDirection from "../../definitions/ShiftDirection";
import { findInstantShiftDistance } from "../../utils/coreOpStateUtils";

export default Operation.Resolve(({ state }, { operations, schema }) => {
    let { activePiece, playfieldGrid, direction, dasRightCharged, dasLeftCharged, settings } = state;
    let shouldAutoShiftRight = dasRightCharged && direction == ShiftDirection.Right;
    let shouldAutoShiftLeft = dasLeftCharged && direction == ShiftDirection.Left;
    let shiftDistance = findInstantShiftDistance(direction, activePiece, playfieldGrid, schema.playfield);
    let shouldContinueInstantShift = settings.arr === 0 && shiftDistance > 0 && (shouldAutoShiftRight || shouldAutoShiftLeft);
    return shouldContinueInstantShift ? operations.shift(shiftDistance) : Operation.None;
})