import Operation from "../../definitions/CoreOperation"
import SideEffect from "../../definitions/SideEffect"
import Settings from "../../definitions/Settings"
import PendingMovement from "../../definitions/PendingMovement"
import DropType from "../../../definitions/DropType"

import TimerName = SideEffect.TimerName

let draftMainUpdates = (settings: Settings.Update) => Operation.Draft(({ state, sideEffectRequests }) => {
    if (settings.das != undefined) {
        let newAutoRepeat = settings.das.autoShiftInterval
        if (newAutoRepeat != undefined && newAutoRepeat != state.settings.das.autoShiftInterval) {
            state.settings.das.autoShiftInterval = newAutoRepeat
            sideEffectRequests.push(SideEffect.Request.TimerInterval(TimerName.AutoShift, newAutoRepeat))
        }

        let newDas = settings.das.delay
        if (newDas != undefined && newDas != state.settings.das.delay) {
            state.settings.das.delay = newDas
            sideEffectRequests.push(SideEffect.Request.TimerInterval(TimerName.DAS, newDas))
        }

        let newDasPreservation = settings.das.preservationEnabled
        if (newDasPreservation != undefined && newDasPreservation != state.settings.das.preservationEnabled) {
            state.settings.das.preservationEnabled = newDasPreservation
        }

        let newDasInterruption = settings.das.interruptionEnabled
        if (newDasInterruption != undefined && newDasInterruption != state.settings.das.interruptionEnabled) {
            state.settings.das.interruptionEnabled = newDasInterruption
        }
    }
    if (settings.softDropInterval != undefined && settings.softDropInterval != state.settings.softDropInterval) {
        state.settings.softDropInterval = settings.softDropInterval
        let pendingMovement = state.pendingMovement
        if (PendingMovement.isDrop(pendingMovement) && pendingMovement.type == DropType.Soft) {
            sideEffectRequests.push(SideEffect.Request.TimerInterval(TimerName.AutoDrop, state.settings.softDropInterval))
        }
    }
})

let sequenceGhostUpdates = (enabled: boolean) => Operation.Resolve(({ state }) => {
    return Operation.Sequence(
        Operation.Draft(({ state }) => { state.settings.ghostEnabled = enabled }),
        Operation.Resolve((_, { operations }) => operations.refreshGhost)
    ).applyIf(enabled != undefined && enabled != state.settings.ghostEnabled)
})

export default (settings: Settings.Update) => Operation.Sequence(
    draftMainUpdates(settings),
    sequenceGhostUpdates(settings.ghostEnabled)
)
