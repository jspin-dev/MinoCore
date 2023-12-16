import Operation from "../../definitions/CoreOperation";
import GameStatus from "../../definitions/GameStatus";
import SideEffect from "../../definitions/SideEffect";

export default Operation.Provide((_, { operations }) => Operation.Sequence(
    operations.next,
    Operation.Draft(({ state, sideEffectRequests }) => { 
        state.status = GameStatus.Active;
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.Clock, SideEffect.TimerOperation.Start))
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoDrop, SideEffect.TimerOperation.Start))
    })
))