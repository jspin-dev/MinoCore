import Operation from "../../definitions/CoreOperation";
import SideEffect from "../../definitions/SideEffect";

export default Operation.Draft(({ sideEffectRequests }) => {
    sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.DAS, SideEffect.TimerOperation.Cancel))
    sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoShift, SideEffect.TimerOperation.Cancel))
})
