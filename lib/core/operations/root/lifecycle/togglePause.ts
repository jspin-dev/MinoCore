import Operation from "../../../definitions/CoreOperation"
import GameStatus from "../../../definitions/GameStatus"
import SideEffect from "../../../definitions/SideEffect"

let rootOperation = Operation.Draft(({ state, sideEffectRequests }) => {
    let initiallyActive = state.status.classifier == GameStatus.Active.classifier
    let operation = initiallyActive ? SideEffect.TimerOperation.Pause : SideEffect.TimerOperation.Resume
    state.status = initiallyActive ? GameStatus.Suspended : GameStatus.Active
    sideEffectRequests.push(...SideEffect.Request.OnAllTimers(operation))
})

export default Operation.Export({ operationName: "togglePause", rootOperation })
