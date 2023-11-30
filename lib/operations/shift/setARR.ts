import Operation from "../../definitions/Operation"
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions"

export default (arr: number) => Operation.Draft(({ state, sideEffectRequests }) => { 
    state.settings.arr = arr;
    sideEffectRequests.push(SideEffectRequest.TimerInterval(TimerName.AutoShift, arr));
})
