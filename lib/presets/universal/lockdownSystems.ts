import LockdownSystems from "../../schema/featurePresets/lockdownSystems"
import LockdownResetPolicy from "../../schema/definitions/LockdownResetPolicy"

namespace LockdownPresets {

    export const defaultMoveLimit = 15

    export const extendedPlacement = LockdownSystems.byResetPolicy(LockdownResetPolicy.Move, defaultMoveLimit)

    export const infinitePlacement = LockdownSystems.byResetPolicy(LockdownResetPolicy.Move)

    export const classic = LockdownSystems.byResetPolicy(LockdownResetPolicy.Step)

}

export default LockdownPresets