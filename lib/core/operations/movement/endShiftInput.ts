import ShiftDirection from "../../../definitions/ShiftDirection"
import Input from "../../../definitions/Input"
import TimerName from "../../definitions/TimerName"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreResult from "../../definitions/CoreResult"
import CoreDependencies from "../../definitions/CoreDependencies"

import { mapOperation, passthroughOperation, sequence, withPreconditions } from "../../../util/operationUtils"
import { cancelPendingOperations, mapCoreState, updateCoreState } from "../../utils/coreOperationUtils"

const updateDirection = (direction: ShiftDirection) => {
    return mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
        const { shiftDirection, dasCharged, activeInputs } = state
        if (shiftDirection != direction) {
            return passthroughOperation
        }
        const newDirection = ShiftDirection.opposite(direction)
        if (dasCharged[newDirection]) {
            return sequence(updateCoreState({ shiftDirection: newDirection }), operations.startAutoShift)
        }
        const activeShiftInput = activeInputs.some(input => {
            return input.classifier == Input.ActiveGame.Classifier.Shift && input.direction == newDirection
        })
        return activeShiftInput
            ? sequence(updateCoreState({ shiftDirection: newDirection }), operations.startDAS)
            : cancelPendingOperations(TimerName.DAS, TimerName.AutoShift)
    })
}

const unchargeDas = (direction: ShiftDirection) => mapCoreState(state => {
    return { dasCharged: { ...state.dasCharged, [direction]: false } }
})

const rootOperation = (direction: ShiftDirection) => sequence(unchargeDas(direction), updateDirection(direction))

export default (direction: ShiftDirection) => withPreconditions({
    operationName: "endShiftInput",
    operation: rootOperation(direction),
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})