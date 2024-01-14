import Operation from "../../../definitions/CoreOperation"
import ShiftDirection from "../../../../definitions/ShiftDirection"

export default Operation.Resolve(({ state }, { operations }) => {
    const { shiftDirection, dasCharged, settings } = state
    const shouldAutoShiftRight = dasCharged[ShiftDirection.Right] && shiftDirection == ShiftDirection.Right
    const shouldAutoShiftLeft = dasCharged[ShiftDirection.Left] && shiftDirection == ShiftDirection.Left
    const availableShiftDistance = state.activePiece.availableShiftDistance[shiftDirection]
    const shouldContinueInstantShift = settings.das.autoShiftInterval === 0
        && availableShiftDistance > 0 && (shouldAutoShiftRight || shouldAutoShiftLeft)
    return shouldContinueInstantShift ? operations.shift(availableShiftDistance) : Operation.None
})