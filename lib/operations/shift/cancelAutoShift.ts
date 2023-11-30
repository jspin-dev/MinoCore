import Operation from "../../definitions/Operation";
import { SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions";

export default Operation.Draft(({ sideEffectRequests }) => {
    sideEffectRequests.push(SideEffectRequest.TimerOperation(TimerName.DAS, TimerOperation.Cancel))
    sideEffectRequests.push(SideEffectRequest.TimerOperation(TimerName.AutoShift, TimerOperation.Cancel))
})
