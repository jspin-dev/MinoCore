import Operation from "../../definitions/CoreOperation"
import SideEffectRequest from "../../definitions/SideEffectRequest"
import Settings from "../../definitions/Settings"
import TimerName from "../../definitions/TimerName"
import Input from "../../../definitions/Input";

let draftMainUpdates = (settings: Settings.Diff) => Operation.Draft(({ state, sideEffectRequests }) => {
    if (settings.das != undefined) {
        let newAutoRepeat = settings.das.autoShiftInterval
        if (newAutoRepeat != undefined && newAutoRepeat != state.settings.das.autoShiftInterval) {
            state.settings.das.autoShiftInterval = newAutoRepeat
            sideEffectRequests.push(SideEffectRequest.TimerInterval({
                timerName: TimerName.AutoShift,
                delay: newAutoRepeat
            }))
        }

        let newDas = settings.das.delay
        if (newDas != undefined && newDas != state.settings.das.delay) {
            state.settings.das.delay = newDas
            sideEffectRequests.push(SideEffectRequest.TimerInterval({
                timerName: TimerName.DAS,
                delay: newDas
            }))
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
        if (state.activeInputs.some(input => input.classifier == Input.ActiveGame.Classifier.SD)) {
            sideEffectRequests.push(SideEffectRequest.TimerInterval({
                timerName: TimerName.Drop,
                delay: state.settings.softDropInterval
            }))
        }
    }
})

let sequenceGhostUpdates = (enabled: boolean) => Operation.Resolve(({ state }) => {
    return Operation.Sequence(
        Operation.Draft(({ state }) => { state.settings.ghostEnabled = enabled }),
        Operation.Resolve((_, { operations }) => operations.refreshGhost)
    ).applyIf(enabled != undefined && enabled != state.settings.ghostEnabled)
})

export default (settings: Settings.Diff) => Operation.Sequence(
    draftMainUpdates(settings),
    sequenceGhostUpdates(settings.ghostEnabled)
)
