import Operation from "../../definitions/CoreOperation";
import SideEffect from "../../definitions/SideEffect";

export default (arr: number) => Operation.Draft(({ state, sideEffectRequests }) => { 
    state.settings.arr = arr;
    sideEffectRequests.push(SideEffect.Request.TimerInterval(SideEffect.TimerName.AutoShift, arr));
})
