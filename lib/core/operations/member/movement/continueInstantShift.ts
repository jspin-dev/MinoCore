import Operation from "../../../definitions/CoreOperation"
import ShiftDirection from "../../../../definitions/ShiftDirection"

export default Operation.Resolve(({ state }, { operations }) => {
    const { shiftDirection, dasCharged } = state
    const shouldAutoShiftRight = dasCharged[ShiftDirection.Right] && shiftDirection == ShiftDirection.Right
    const shouldAutoShiftLeft = dasCharged[ShiftDirection.Left] && shiftDirection == ShiftDirection.Left
    const availableShiftDistance = state.activePiece.availableShiftDistance[shiftDirection]
    const shouldContinueInstantShift = state.settings.dasMechanics.autoShiftInterval === 0
        && availableShiftDistance > 0 && (shouldAutoShiftRight || shouldAutoShiftLeft)
    return shouldContinueInstantShift ? operations.shift(availableShiftDistance) : Operation.None
})