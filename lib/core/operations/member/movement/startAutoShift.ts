import Operation from "../../../definitions/CoreOperation"
import SideEffect from "../../../definitions/SideEffect"
import CorePreconditions from "../../../utils/CorePreconditions"

import TimerName = SideEffect.TimerName
import TimerOperation = SideEffect.TimerOperation

let resolveMovement = Operation.Resolve (({ state }, { operations }) => {
    let { activePiece, shiftDirection, settings } = state
    let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerOperation(TimerName.AutoShift, TimerOperation.Start))
    })
    let applyDasPostIntervalShift = operations.shift(1).applyIf(settings.das.postDelayShiftEnabled)
    return settings.das.autoShiftInterval == 0
        ? operations.shift(activePiece.availableShiftDistance[shiftDirection])
        : Operation.Sequence(applyDasPostIntervalShift, draftTimerChange)
})

let draftChanges = Operation.Draft(({ state, sideEffectRequests }) => {
    sideEffectRequests.push(SideEffect.Request.TimerOperation(TimerName.DAS, TimerOperation.Cancel))
    state.dasCharged[state.shiftDirection] = true
})

export default Operation.Export({
    operationName: "startAutoShift",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: Operation.Sequence(draftChanges, resolveMovement)
})
