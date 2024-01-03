import type ActivePiece from "../../definitions/ActivePiece"
import MovementType from "../../definitions/MovementType"
import LockdownStatus from "../../core/definitions/LockdownStatus"
import Outcome from "../../definitions/Outcome"

interface LockdownProvider {
    processMovement: (
        params: {
            movement: MovementType,
            lockdownStatus: LockdownStatus,
            activePiece: ActivePiece
        }
    ) => Outcome<LockdownStatus>
}

export default LockdownProvider