import Operation from "../../../definitions/CoreOperation"
import SideEffect from "../../../definitions/SideEffect"
import CorePreconditions from "../../../utils/CorePreconditions"
import DropType from "../../../../definitions/DropType"

let resolveDrop = Operation.Resolve(({ state }, { operations }) => {
    let autoDrop = Operation.Draft(({ state, sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerInterval(SideEffect.TimerName.AutoDrop, state.settings.softDropInterval))
    })
    return state.settings.softDropInterval == 0
        ? operations.drop(DropType.Soft, state.activePiece.availableDropDistance)
        : autoDrop
})

let rootOperation = Operation.Resolve((_, { operations }) => Operation.Sequence(
    operations.drop(DropType.Soft, 1),
    resolveDrop
))

export default Operation.Export({
    operationName: "startSoftDrop",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: rootOperation
})