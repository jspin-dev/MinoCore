import LockdownSystem from "../definitions/LockdownSystem"
import MovementType from "../../definitions/MovementType"
import LockdownStatus from "../../core/definitions/LockdownStatus"
import Outcome from "../../definitions/Outcome"
import LockdownResetPolicy from "../definitions/LockdownResetPolicy"

namespace LockdownSystems {

    export const byResetPolicy = (resetPolicy: LockdownResetPolicy, moveLimit?: number) => {
        return {
            processMovement(params) {
                const { movement, coreState } = params
                const activePiece = coreState.activePiece
                const lockdownStatus = activePiece.lockdownStatus
                const onFloor = activePiece.availableDropDistance == 0
                const resetTimerStatus = LockdownStatus.TimerActive({ movesRemaining: moveLimit })

                if (lockdownStatus.classifier != LockdownStatus.Classifier.NoLockdown && activePiece.location.y > activePiece.maxDepth) {
                    return Outcome.Success(onFloor ? resetTimerStatus : LockdownStatus.NoLockdown)
                }
                switch (lockdownStatus.classifier) {
                    case LockdownStatus.Classifier.NoLockdown:
                        if (onFloor) {
                            return Outcome.Success(resetTimerStatus)
                        }
                        break
                    case LockdownStatus.Classifier.TimerActive:
                        if (movement == MovementType.Shift || movement == MovementType.Rotate) {
                            if (moveLimit > 0 && lockdownStatus.movesRemaining == 0) {
                                return Outcome.Success(LockdownStatus.Triggered)
                            }
                            if (resetPolicy == LockdownResetPolicy.Move) {
                                const movesRemaining = moveLimit == null ? null : lockdownStatus.movesRemaining - 1
                                const newLockStatus = LockdownStatus.TimerActive({ movesRemaining })
                                return Outcome.Success(newLockStatus)
                            }
                        }
                }
                return Outcome.Failure()
            }
        } satisfies LockdownSystem
    }

}

export default LockdownSystems