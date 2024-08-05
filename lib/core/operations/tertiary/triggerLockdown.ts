import LockdownStatus from "../../definitions/LockdownStatus"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreResult from "../../definitions/CoreResult"
import CoreDependencies from "../../definitions/CoreDependencies"
import { mapCoreState } from "../../utils/coreOperationUtils"
import { mapOperation, withCondition, sequence, withPreconditions } from "../../../util/operationUtils"

const conditionalLock = mapOperation((previousResult: CoreResult, { operations }: CoreDependencies) => {
    return withCondition(operations.lock, previousResult.state.activePiece.availableDropDistance == 0)
})

const updateLockdownStatus = mapCoreState(state => {
    return {
        activePiece: { ...state.activePiece, lockdownStatus: LockdownStatus.Triggered }
    }
})

const rootOperation = sequence(updateLockdownStatus, conditionalLock)

// noinspection JSUnusedGlobalSymbols
export default withPreconditions({
    operationName: "triggerLockdown",
    operation: rootOperation,
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})
