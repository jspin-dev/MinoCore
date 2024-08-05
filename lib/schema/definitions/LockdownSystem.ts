import MovementType from "../../definitions/MovementType"
import LockdownStatus from "../../core/definitions/LockdownStatus"
import Outcome from "../../definitions/Outcome"
import CoreState from "../../core/definitions/CoreState";

interface LockdownSystem {
    processMovement: <S extends CoreState>(params: LockdownSystem.Params<S>) => Outcome<LockdownStatus>
}

namespace LockdownSystem {

    export interface Params<S extends CoreState> {
        coreState: S
        movement: MovementType
    }

}
export default LockdownSystem