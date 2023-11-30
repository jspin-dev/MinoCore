import Operation from "../../definitions/Operation";
import { GameStatus, SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions";

export default Operation.Provide((_, { operations }) => Operation.Sequence(
    operations.next,
    Operation.Draft(({ state, sideEffectRequests }) => { 
        state.meta.status = GameStatus.Active;
        sideEffectRequests.push(SideEffectRequest.TimerOperation(TimerName.Clock, TimerOperation.Start))
        sideEffectRequests.push(SideEffectRequest.TimerOperation(TimerName.AutoDrop, TimerOperation.Start))
    }),
))