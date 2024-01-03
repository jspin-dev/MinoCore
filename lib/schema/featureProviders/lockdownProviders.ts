import LockdownProvider from "../definitions/LockdownProvider"
import MovementType from "../../definitions/MovementType"
import LockdownStatus from "../../core/definitions/LockdownStatus"
import Outcome from "../../definitions/Outcome"
import LockdownResetPolicy from "../definitions/LockdownResetPolicy"

namespace LockdownProviders {

    export let standard = (resetPolicy: LockdownResetPolicy, moveLimit?: number): LockdownProvider => {
        return {
            processMovement(params): Outcome<LockdownStatus> {
                let { movement, lockdownStatus, activePiece } = params
                let onFloor = activePiece.availableDropDistance == 0
                let resetTimerStatus = LockdownStatus.TimerActive({ movesRemaining: moveLimit })

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
                                let movesRemaining = moveLimit == null ? null : lockdownStatus.movesRemaining - 1
                                let newLockStatus = LockdownStatus.TimerActive({ movesRemaining })
                                return Outcome.Success(newLockStatus)
                            }
                        }
                }
                return Outcome.Failure()
            }
        }
    }

}

export default LockdownProviders