import LockdownStatus from "../definitions/LockdownStatus"
import TimerName from "../definitions/TimerName"
import MovementType from "../../definitions/MovementType"
import Outcome from "../../definitions/Outcome"
import CorePreconditions from "../utils/CorePreconditions"
import CoreResult from "../definitions/CoreResult"
import CoreDependencies from "../definitions/CoreDependencies"
import CoreState from "../definitions/CoreState"

import { mapOperation, passthroughOperation, sequence, withCondition, withPreconditions } from "../../util/operationUtils"
import { delayOperation, cancelPendingOperation, mapCoreState, mapFromOperations } from "../utils/coreOperationUtils"

const updateLockdownStatus = (newStatus: LockdownStatus) => mapCoreState(({ activePiece }: CoreState) => {
    const depth = activePiece.location.y
    const maxDepth = activePiece.maxDepth
    return {
        lockdownStatus: newStatus,
        activePiece: { ...activePiece, maxDepth: depth > maxDepth ? depth : maxDepth }
    }
})

const getTimerChange = (newStatus: LockdownStatus) => mapFromOperations(operations => {
    switch (newStatus.classifier) {
        case LockdownStatus.Classifier.NoLockdown:
        case LockdownStatus.Classifier.Triggered:
            return cancelPendingOperation(TimerName.DropLock)
        case LockdownStatus.Classifier.TimerActive:
            return delayOperation({
                timerName: TimerName.DropLock,
                delayInMillis: 500,
                operation: operations.triggerLockdown
            })
    }
})

const lockOnTrigger = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
    const shouldLock = state.lockdownStatus.classifier == LockdownStatus.Classifier.Triggered
        && state.activePiece.availableDropDistance == 0
    return withCondition(operations.lock, shouldLock)
})

const rootOperation = (movementType: MovementType) => {
    return mapOperation(({ state }: CoreResult, { schema }: CoreDependencies) => {
        const outcome = schema.lockdownSystem.processMovement({ movement: movementType, coreState: state })
        return sequence(
            Outcome.isSuccess(outcome)
                ? sequence(updateLockdownStatus(outcome.data), getTimerChange(outcome.data))
                : passthroughOperation,
            lockOnTrigger
        )
    })
}

export default (movementType: MovementType) => withPreconditions({
    operationName: "updateLockStatus",
    operation: rootOperation(movementType),
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
