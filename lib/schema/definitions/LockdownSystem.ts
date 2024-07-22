import MovementType from "../../definitions/MovementType"
import LockdownStatus from "../../core/definitions/LockdownStatus"
import Outcome from "../../definitions/Outcome"
import CoreState from "../../core/definitions/CoreState";

interface LockdownSystem {
    processMovement: <S extends CoreState>(
        params: { movement: MovementType, coreState: S }
    ) => Outcome<LockdownStatus>
}

export default LockdownSystem