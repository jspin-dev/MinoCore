import Operation from "../../definitions/CoreOperation"
import { SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions"

export default (das: number) => Operation.Draft(({ state, sideEffectRequests }) => { 
    state.settings.das = das;
    sideEffectRequests.push(SideEffectRequest.TimerInterval(TimerName.DAS, das));
})
