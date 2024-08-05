import CorePreconditions from "../../../utils/CorePreconditions"
import TimerName from "../../../definitions/TimerName"
import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import { mapOperation, sequence, withPreconditions } from "../../../../util/operationUtils"
import { delayOperation, cancelPendingOperations } from "../../../utils/coreOperationUtils"

const initiateMovement = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
    return state.settings.dasMechanics.delay === 0
        ? operations.startAutoShift
        : delayOperation({
            timerName: TimerName.DAS,
            delayInMillis: state.settings.dasMechanics.delay,
            operation: operations.startAutoShift
        })
})

const rootOperation = sequence(cancelPendingOperations(TimerName.DAS, TimerName.AutoShift), initiateMovement)

export default withPreconditions({
    operationName: "startDAS",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
