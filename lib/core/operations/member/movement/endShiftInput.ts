import Operation from "../../../definitions/CoreOperation"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions from "../../../utils/CorePreconditions"
import SideEffect from "../../../definitions/SideEffect"
import Input from "../../../../definitions/Input"

import TimerName = SideEffect.TimerName
import TimerOperation = SideEffect.TimerOperation

let resolveNewDirection = (direction: ShiftDirection) => Operation.Resolve(({ state }, { operations }) => {
    if (state.shiftDirection != direction) {
        return Operation.None
    }
    let newDirection = ShiftDirection.opposite(direction)
    if (state.dasCharged[newDirection]) {
        return Operation.Sequence(
            Operation.Draft(({ state }) => { state.shiftDirection = newDirection }),
            operations.startAutoShift
        )
    }
    let activeShiftInput = state.activeInputs.some(input => {
        return input.classifier == Input.ActiveGame.Classifier.Shift && input.direction == newDirection
    })
    let startDas = Operation.Sequence(
        Operation.Draft(({ state }) => { state.shiftDirection = newDirection }),
        operations.startDAS
    )
    let cancelDas = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerOperation(TimerName.DAS, TimerOperation.Cancel))
        sideEffectRequests.push(SideEffect.Request.TimerOperation(TimerName.AutoShift, TimerOperation.Cancel))
    })
    return activeShiftInput ? startDas : cancelDas
})

let rootOperation = (direction: ShiftDirection) => Operation.Sequence(
    Operation.Draft(({ state }) => { state.dasCharged[direction] = false }),
    resolveNewDirection(direction)
)

export default (direction: ShiftDirection) => Operation.Export({
    operationName: "endShiftInput",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: rootOperation(direction)
})