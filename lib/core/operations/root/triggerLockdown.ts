import Operation from "../../definitions/CoreOperation"
import LockdownStatus from "../../definitions/LockdownStatus"
import CorePreconditions from "../../utils/CorePreconditions"

const rootOperation = Operation.Sequence(
    Operation.Draft(({ state }) => { state.lockdownStatus = LockdownStatus.Triggered }),
    Operation.Resolve(({ state }, { operations }) => {
        return operations.lock.applyIf(state.activePiece.availableDropDistance == 0)
    })
)
export default Operation.Export({
    operationName: "triggerLockdown",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation
})