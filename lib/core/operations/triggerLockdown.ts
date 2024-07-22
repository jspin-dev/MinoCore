import LockdownStatus from "../definitions/LockdownStatus"
import CorePreconditions from "../utils/CorePreconditions"
import CoreResult from "../definitions/CoreResult"
import CoreDependencies from "../definitions/CoreDependencies"
import { updateCoreState } from "../utils/coreOperationUtils"
import { mapOperation, withCondition, sequence, withPreconditions } from "../../util/operationUtils"

const conditionalLock = mapOperation((previousResult: CoreResult, { operations }: CoreDependencies) => {
    return withCondition(operations.lock, previousResult.state.activePiece.availableDropDistance == 0)
})

const rootOperation = sequence(updateCoreState({ lockdownStatus: LockdownStatus.Triggered }), conditionalLock)

// noinspection JSUnusedGlobalSymbols
export default withPreconditions({
    operationName: "triggerLockdown",
    operation: rootOperation,
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})
