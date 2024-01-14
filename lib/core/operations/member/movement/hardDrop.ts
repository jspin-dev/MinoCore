import Operation from "../../../definitions/CoreOperation"
import DropType from "../../../../definitions/DropType"
import CorePreconditions from "../../../utils/CorePreconditions"

const rootOperation = Operation.Resolve(({ state }, { operations }) => Operation.Sequence(
    operations.drop(DropType.Hard, state.activePiece.availableDropDistance),
    operations.lock
))

export default Operation.Export({
    operationName: "hardDrop",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation
})
