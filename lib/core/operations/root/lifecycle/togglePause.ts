import Operation from "../../../definitions/CoreOperation"
import GameStatus from "../../../definitions/GameStatus"
import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerOperation from "../../../definitions/TimerOperation"

let rootOperation = Operation.Draft(({ state, sideEffectRequests }) => {
    let initiallyActive = state.status == GameStatus.Active
    let operation = initiallyActive ? TimerOperation.Pause : TimerOperation.Resume
    state.status = initiallyActive ? GameStatus.Suspended : GameStatus.Active
    sideEffectRequests.push(...SideEffectRequest.OnAllTimers(operation))
})

export default Operation.Export({ operationName: "togglePause", rootOperation })
