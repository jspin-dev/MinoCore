import LockdownSystems from "../../schema/featureProviders/lockdownSystems"
import LockdownResetPolicy from "../../schema/definitions/LockdownResetPolicy"

namespace LockdownPresets {

    export const defaultMoveLimit = 15

    export const extendedPlacement = LockdownSystems.standard(LockdownResetPolicy.Move, defaultMoveLimit)

    export const infinitePlacement = LockdownSystems.standard(LockdownResetPolicy.Move)

    export const classic = LockdownSystems.standard(LockdownResetPolicy.Step)

}

export default LockdownPresets