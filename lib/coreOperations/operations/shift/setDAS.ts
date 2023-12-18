import Operation from "../../definitions/CoreOperation"
import SideEffect from "../../definitions/SideEffect";

export default (das: number) => Operation.Draft(({ state, sideEffectRequests }) => { 
    state.settings.das = das;
    sideEffectRequests.push(SideEffect.Request.TimerInterval(SideEffect.TimerName.DAS, das));
})
