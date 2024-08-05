import DropType from "../../../../definitions/DropType"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import { mapOperation, sequence, withPreconditions } from "../../../../util/operationUtils"

const rootOperation = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => sequence(
    operations.drop(DropType.Hard, state.activePiece.availableDropDistance),
    operations.lock
))

export default withPreconditions({
    operationName: "hardDrop",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})