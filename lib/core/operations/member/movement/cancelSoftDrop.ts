import Operation from "../../../definitions/CoreOperation"
import SideEffect from "../../../definitions/SideEffect"
import CorePreconditions from "../../../utils/CorePreconditions"

let rootOperation = Operation.Draft(({ state, sideEffectRequests }) => {
    sideEffectRequests.push(SideEffect.Request.TimerInterval(SideEffect.TimerName.AutoDrop, state.settings.dropInterval))
})

export default Operation.Export({
    operationName: "cancelSoftDrop",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: rootOperation
})