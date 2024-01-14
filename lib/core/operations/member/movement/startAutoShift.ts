import Operation from "../../../definitions/CoreOperation"
import CorePreconditions from "../../../utils/CorePreconditions"
import TimerOperation from "../../../definitions/TimerOperation"
import TimerName from "../../../definitions/TimerName"
import SideEffectRequest from "../../../definitions/SideEffectRequest"

const resolveMovement = Operation.Resolve (({ state }, { operations }) => {
    const { activePiece, shiftDirection, settings } = state
    const draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffectRequest.TimerOperation({
            timerName: TimerName.AutoShift,
            operation: TimerOperation.Start
        }))
    })
    const applyDasPostIntervalShift = operations.shift(1).applyIf(settings.das.postDelayShiftEnabled)
    return settings.das.autoShiftInterval == 0
        ? operations.shift(activePiece.availableShiftDistance[shiftDirection])
        : Operation.Sequence(applyDasPostIntervalShift, draftTimerChange)
})

const draftChanges = Operation.Draft(({ state, sideEffectRequests }) => {
    sideEffectRequests.push(SideEffectRequest.TimerOperation({
        timerName: TimerName.DAS,
        operation: TimerOperation.Cancel
    }))
    state.dasCharged[state.shiftDirection] = true
})

export default Operation.Export({
    operationName: "startAutoShift",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: Operation.Sequence(draftChanges, resolveMovement)
})
