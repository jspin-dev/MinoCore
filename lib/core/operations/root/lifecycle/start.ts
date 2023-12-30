import Operation from "../../../definitions/CoreOperation"
import GameStatus from "../../../definitions/GameStatus"
import SideEffect from "../../../definitions/SideEffect"

let rootOperation = Operation.Resolve((_, { operations }) => Operation.Sequence(
    Operation.Draft(({ state, sideEffectRequests }) => { 
        state.status = GameStatus.Active
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.Clock, SideEffect.TimerOperation.Start))
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoDrop, SideEffect.TimerOperation.Start))
    }),
    operations.next
))

export default Operation.Export({ operationName: "start", rootOperation })