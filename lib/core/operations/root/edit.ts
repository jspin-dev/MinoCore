import CoreState from "../../definitions/CoreState"
import Operation from "../../definitions/CoreOperation"
import SideEffectRequest from "../../definitions/SideEffectRequest";
import TimerName from "../../definitions/TimerName";

export const rootOperation = (diff: CoreState.Diff) => Operation.Draft(({ state, sideEffectRequests }) => {
    Object.assign(state, diff.partial)
    Object.assign(state.activePiece, diff.activePiece)
    diff.playfield?.forEach(({ cell, x, y }) => {
        state.playfield[y][x] = cell
    })
    if (diff.settings) {
        if (diff.settings.dasMechanics.autoShiftInterval != state.settings.dasMechanics.autoShiftInterval) {
            sideEffectRequests.push(SideEffectRequest.TimerInterval({
                timerName: TimerName.AutoShift,
                delay: diff.settings.dasMechanics.autoShiftInterval
            }))
        }
        if (diff.settings.dasMechanics.delay != state.settings.dasMechanics.delay) {
            sideEffectRequests.push(SideEffectRequest.TimerInterval({
                timerName: TimerName.DAS,
                delay: diff.settings.dasMechanics.delay
            }))
        }
        Object.assign(state.settings, diff.settings)
    }
})

export default (diff: CoreState.Diff) => Operation.Export({
    operationName: "edit",
    rootOperation: rootOperation(diff)
})