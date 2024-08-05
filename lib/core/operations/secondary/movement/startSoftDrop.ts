import TimerName from "../../../definitions/TimerName"
import DropType from "../../../../definitions/DropType"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import CoreOperation from "../../../definitions/CoreOperation"
import { delayOperation, mapFromOperations } from "../../../utils/coreOperationUtils"
import { mapOperation, sequence, withPreconditions } from "../../../../util/operationUtils"

const incrementalSoftDrop: CoreOperation = mapOperation(({ state }, { operations }) => delayOperation({
    timerName: TimerName.Drop,
    delayInMillis: state.settings.dropMechanics.softInterval,
    operation: sequence(operations.drop(DropType.Soft, 1), incrementalSoftDrop)
}))

let performDrop = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
    return state.settings.dropMechanics.softInterval == 0
        ? operations.drop(DropType.Soft, state.activePiece.availableDropDistance)
        : incrementalSoftDrop
})

const rootOperation = mapFromOperations(operations => sequence(
    operations.drop(DropType.Soft, 1),
    performDrop
))

export default withPreconditions({
    operationName: "startShiftInput",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})

