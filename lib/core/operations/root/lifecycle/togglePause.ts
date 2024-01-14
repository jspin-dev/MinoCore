import Operation from "../../../definitions/CoreOperation"
import GameStatus from "../../../definitions/GameStatus"
import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerOperation from "../../../definitions/TimerOperation"

const rootOperation = Operation.Draft(({ state, sideEffectRequests }) => {
    const initiallyActive = state.status == GameStatus.Active
    const operation = initiallyActive ? TimerOperation.Pause : TimerOperation.Resume
    state.status = initiallyActive ? GameStatus.Suspended : GameStatus.Active
    sideEffectRequests.push(...SideEffectRequest.OnAllTimers(operation))
})

export default Operation.Export({ operationName: "togglePause", rootOperation })
