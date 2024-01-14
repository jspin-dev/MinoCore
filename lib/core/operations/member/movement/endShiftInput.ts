import Operation from "../../../definitions/CoreOperation"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions from "../../../utils/CorePreconditions"
import Input from "../../../../definitions/Input"
import TimerName from "../../../definitions/TimerName"
import TimerOperation from "../../../definitions/TimerOperation"
import SideEffectRequest from "../../../definitions/SideEffectRequest"

const resolveNewDirection = (direction: ShiftDirection) => Operation.Resolve(({ state }, { operations }) => {
    if (state.shiftDirection != direction) {
        return Operation.None
    }
    const newDirection = ShiftDirection.opposite(direction)
    if (state.dasCharged[newDirection]) {
        return Operation.Sequence(
            Operation.Draft(({ state }) => { state.shiftDirection = newDirection }),
            operations.startAutoShift
        )
    }
    const activeShiftInput = state.activeInputs.some(input => {
        return input.classifier == Input.ActiveGame.Classifier.Shift && input.direction == newDirection
    })
    const startDas = Operation.Sequence(
        Operation.Draft(({ state }) => { state.shiftDirection = newDirection }),
        operations.startDAS
    )
    const cancelDas = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffectRequest.TimerOperation({
            timerName: TimerName.DAS,
            operation: TimerOperation.Cancel
        }))
        sideEffectRequests.push(SideEffectRequest.TimerOperation({
            timerName: TimerName.AutoShift,
            operation: TimerOperation.Cancel
        }))
    })
    return activeShiftInput ? startDas : cancelDas
})

const rootOperation = (direction: ShiftDirection) => Operation.Sequence(
    Operation.Draft(({ state }) => { state.dasCharged[direction] = false }),
    resolveNewDirection(direction)
)

export default (direction: ShiftDirection) => Operation.Export({
    operationName: "endShiftInput",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: rootOperation(direction)
})