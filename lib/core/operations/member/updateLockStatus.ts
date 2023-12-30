import Operation from "../../definitions/CoreOperation"
import LockdownStatus from "../../definitions/LockdownStatus"
import MovementType from "../../../definitions/MovementType"
import SideEffect from "../../definitions/SideEffect"
import Outcome from "../../../definitions/Outcome"
import CorePreconditions from "../../utils/CorePreconditions"

let updateLockdownStatus = (newStatus: LockdownStatus) => {
    return Operation.Draft(({ state, sideEffectRequests }) => {
        state.lockdownStatus = newStatus
        let depth = state.activePiece.location.y
        if (depth > state.activePiece.maxDepth) {
            state.activePiece.maxDepth = depth
        }
        let timerRequest = (timerOp: SideEffect.TimerOperation) => SideEffect.Request.TimerOperation(SideEffect.TimerName.DropLock, timerOp)
        switch (newStatus.classifier) {
            case LockdownStatus.Classifier.NoLockdown:
            case LockdownStatus.Classifier.Triggered:
                sideEffectRequests.push(timerRequest(SideEffect.TimerOperation.Cancel))
                break
            case LockdownStatus.Classifier.TimerActive:
                sideEffectRequests.push(timerRequest(SideEffect.TimerOperation.Start))
        }
    })
}

let rootOperation = (movementType: MovementType) => Operation.Resolve(({ state }, { schema, operations }) => {
    let outcome = schema.lockProvider.processMovement(movementType, state.lockdownStatus, state.activePiece)
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