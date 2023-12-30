import Operation from "../../../definitions/CoreOperation"
import SideEffect from "../../../definitions/SideEffect"
import CorePreconditions from "../../../utils/CorePreconditions"

let resolveMovement = Operation.Resolve(({ state }, { operations }) => {
    let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.DAS, SideEffect.TimerOperation.Start))
    })
    return state.settings.das.delay === 0 ? operations.startAutoShift : draftTimerChange
})

let draftAutoShiftCancellation = Operation.Draft(({ sideEffectRequests }) => {
    sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.DAS, SideEffect.TimerOperation.Cancel))
    sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoShift, SideEffect.TimerOperation.Cancel))
})

let rootOperation = Operation.Sequence(draftAutoShiftCancellation, resolveMovement)

export default Operation.Export({
    operationName: "startDAS",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation
})
