import Operation from "../../definitions/CoreOperation"
import SideEffect from "../../definitions/SideEffect"

export default (softDropInterval: number) => Operation.Draft(({ state, sideEffectRequests }) => { 
    state.settings.softDropInterval = softDropInterval
    if (state.softDropActive) {
        sideEffectRequests.push(SideEffect.Request.TimerInterval(SideEffect.TimerName.AutoDrop, softDropInterval))
    }
})