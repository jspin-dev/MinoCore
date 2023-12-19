import Operation from "../../definitions/CoreOperation";
import ShiftDirection from "../../../definitions/ShiftDirection";

export default Operation.Resolve(({ state }, { operations }) => {
    let { direction, dasRightCharged, dasLeftCharged, settings } = state;
    let shouldAutoShiftRight = dasRightCharged && direction == ShiftDirection.Right;
    let shouldAutoShiftLeft = dasLeftCharged && direction == ShiftDirection.Left;
    let availableShiftDistance = state.activePiece.availableShiftDistance[direction];
    let shouldContinueInstantShift = settings.arr === 0 && availableShiftDistance > 0 && (shouldAutoShiftRight || shouldAutoShiftLeft);
    return shouldContinueInstantShift ? operations.shift(availableShiftDistance) : Operation.None;
})