import Operation from "../../../definitions/CoreOperation"
import GameStatus from "../../../definitions/GameStatus"
import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerName from "../../../definitions/TimerName"
import TimerOperation from "../../../definitions/TimerOperation"

let rootOperation = Operation.Resolve((_, { operations }) => Operation.Sequence(
    Operation.Draft(({ state, sideEffectRequests }) => { 
        state.status = GameStatus.Active
        sideEffectRequests.push(SideEffectRequest.TimerOperation({
            timerName: TimerName.Clock,
            operation: TimerOperation.Start
        }))
        sideEffectRequests.push(SideEffectRequest.TimerOperation({
            timerName: TimerName.Drop,
            operation: TimerOperation.Start
        }))
    }),
    operations.next
))

export default Operation.Export({ operationName: "start", rootOperation })