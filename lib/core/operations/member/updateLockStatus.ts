import Operation from "../../definitions/CoreOperation"
import LockdownStatus from "../../definitions/LockdownStatus"
import MovementType from "../../../definitions/MovementType"
import Outcome from "../../../definitions/Outcome"
import CorePreconditions from "../../utils/CorePreconditions"
import TimerOperation from "../../definitions/TimerOperation"
import SideEffectRequest from "../../definitions/SideEffectRequest"
import TimerName from "../../definitions/TimerName"

let updateLockdownStatus = (newStatus: LockdownStatus) => {
    return Operation.Draft(({ state, sideEffectRequests }) => {
        state.lockdownStatus = newStatus
        let depth = state.activePiece.location.y
        if (depth > state.activePiece.maxDepth) {
            state.activePiece.maxDepth = depth
        }
        let timerRequest = (operation: TimerOperation) => SideEffectRequest.TimerOperation({
            timerName: TimerName.DropLock,
            operation
        })
        switch (newStatus.classifier) {
            case LockdownStatus.Classifier.NoLockdown:
            case LockdownStatus.Classifier.Triggered:
                sideEffectRequests.push(timerRequest(TimerOperation.Cancel))
                break
            case LockdownStatus.Classifier.TimerActive:
                sideEffectRequests.push(timerRequest(TimerOperation.Start))
        }
    })
}

let rootOperation = (movementType: MovementType) => Operation.Resolve(({ state }, { schema, operations }) => {
    let outcome = schema.lockProvider.processMovement({
        movement: movementType,
        lockdownStatus: state.lockdownStatus,
        activePiece: state.activePiece
    })
    return Operation.Sequence(
        Outcome.isSuccess(outcome) ? updateLockdownStatus(outcome.data) : Operation.None,
        Operation.Resolve(({ state }) => {
            let shouldLock = state.lockdownStatus.classifier == LockdownStatus.Classifier.Triggered
                && state.activePiece.availableDropDistance == 0
            return operations.lock.applyIf(shouldLock)
        })
    )
})

export default (movementType: MovementType) => Operation.Export({
    operationName: "updateLockStatus",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: rootOperation(movementType)
})