import TimerName from "../../definitions/TimerName"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreOperation from "../../definitions/CoreOperation"
import DropType from "../../../definitions/DropType"
import { mapOperation, sequence, withPreconditions } from "../../../util/operationUtils"
import { delayOperation } from "../../utils/coreOperationUtils"

const rootOperation: CoreOperation = mapOperation(({ state }, { operations }) => delayOperation({
    timerName: TimerName.Drop,
    delayInMillis: state.settings.dropMechanics.autoInterval,
    operation: sequence(operations.drop(DropType.Auto, 1), rootOperation)
}))

export default withPreconditions({
    operationName: "cancelSoftDrop",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})