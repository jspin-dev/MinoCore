import Operation from "../../../definitions/CoreOperation"
import ShiftDirection from "../../../../definitions/ShiftDirection"

export default Operation.Resolve(({ state }, { operations }) => {
    let { shiftDirection, dasCharged, settings } = state
    let shouldAutoShiftRight = dasCharged[ShiftDirection.Right] && shiftDirection == ShiftDirection.Right
    let shouldAutoShiftLeft = dasCharged[ShiftDirection.Left] && shiftDirection == ShiftDirection.Left
    let availableShiftDistance = state.activePiece.availableShiftDistance[shiftDirection]
    let shouldContinueInstantShift = settings.das.autoShiftInterval === 0
        && availableShiftDistance > 0 && (shouldAutoShiftRight || shouldAutoShiftLeft)
    return shouldContinueInstantShift ? operations.shift(availableShiftDistance) : Operation.None
})