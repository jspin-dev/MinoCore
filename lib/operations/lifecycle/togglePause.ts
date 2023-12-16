import Operation from "../../definitions/CoreOperation";
import GameStatus from "../../definitions/GameStatus";
import SideEffect from "../../definitions/SideEffect";

export default Operation.Draft(({ state, sideEffectRequests }) => {
    let initiallyActive = state.status.classifier == GameStatus.Active.classifier;
    let operation = initiallyActive ? SideEffect.TimerOperation.Pause : SideEffect.TimerOperation.Resume;
    state.status = initiallyActive ? GameStatus.Suspended : GameStatus.Active;
    sideEffectRequests = [
        ...sideEffectRequests,
        SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoDrop, operation),
        SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoShift, operation),
        SideEffect.Request.TimerOperation(SideEffect.TimerName.Clock, operation),
        SideEffect.Request.TimerOperation(SideEffect.TimerName.DAS, operation),
        SideEffect.Request.TimerOperation(SideEffect.TimerName.DropLock, operation) 
    ]
})
