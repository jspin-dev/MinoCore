import Operation from "../../../definitions/CoreOperation"
import CorePreconditions from "../../../utils/CorePreconditions"
import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerName from "../../../definitions/TimerName"
import TimerOperation from "../../../definitions/TimerOperation"

let resolveMovement = Operation.Resolve(({ state }, { operations }) => {
    let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffectRequest.TimerOperation({
            timerName: TimerName.DAS,
            operation: TimerOperation.Start
        }))
    })
    return state.settings.das.delay === 0 ? operations.startAutoShift : draftTimerChange
})

let draftAutoShiftCancellation = Operation.Draft(({ sideEffectRequests }) => {
    sideEffectRequests.push(SideEffectRequest.TimerOperation({
        timerName: TimerName.DAS,
        operation: TimerOperation.Cancel
    }))
    sideEffectRequests.push(SideEffectRequest.TimerOperation({
        timerName: TimerName.AutoShift,
        operation: TimerOperation.Cancel
    }))
})

let rootOperation = Operation.Sequence(draftAutoShiftCancellation, resolveMovement)

export default Operation.Export({
    operationName: "startDAS",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation
})
