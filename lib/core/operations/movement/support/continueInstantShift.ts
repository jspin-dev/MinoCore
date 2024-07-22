import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import CorePreconditions from "../../../utils/CorePreconditions"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import { mapOperation, withCondition, withPreconditions } from "../../../../util/operationUtils"

const rootOperation = mapOperation((previousResult: CoreResult, { operations }: CoreDependencies) => {
    const { shiftDirection, dasCharged, activePiece, settings } = previousResult.state
    const shouldAutoShiftRight = dasCharged[ShiftDirection.Right] && shiftDirection == ShiftDirection.Right
    const shouldAutoShiftLeft = dasCharged[ShiftDirection.Left] && shiftDirection == ShiftDirection.Left
    const availableShiftDistance = activePiece.availableShiftDistance[shiftDirection]
    const shouldContinueInstantShift = settings.dasMechanics.autoShiftInterval === 0
        && availableShiftDistance > 0
        && (shouldAutoShiftRight || shouldAutoShiftLeft)
    return withCondition(operations.shift(availableShiftDistance), shouldContinueInstantShift)
})

export default withPreconditions({
    operationName: "continueInstantShift",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame]
})