import Operation from "../../definitions/Operation";
import { GameStatus, SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions";

export default Operation.Draft(({ state, sideEffectRequests }) => {
    let initiallyActive = state.meta.status.classifier == GameStatus.Active.classifier;
    let operation = initiallyActive ? TimerOperation.Pause : TimerOperation.Resume;
    state.meta.status = initiallyActive ? GameStatus.Suspended : GameStatus.Active;
    sideEffectRequests = [
        ...sideEffectRequests,
        SideEffectRequest.TimerOperation(TimerName.AutoDrop, operation),
        SideEffectRequest.TimerOperation(TimerName.AutoShift, operation),
        SideEffectRequest.TimerOperation(TimerName.Clock, operation),
        SideEffectRequest.TimerOperation(TimerName.DAS, operation),
        SideEffectRequest.TimerOperation(TimerName.DropLock, operation) 
    ]
})
