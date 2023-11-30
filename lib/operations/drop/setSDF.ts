import Operation from "../../definitions/Operation"
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions"

export default (softDropInterval: number) => Operation.Draft(({ state, sideEffectRequests }) => { 
    state.settings.softDropInterval = softDropInterval
    if (state.meta.softDropActive) {
        sideEffectRequests.push(SideEffectRequest.TimerInterval(TimerName.AutoDrop, softDropInterval))
    }
})