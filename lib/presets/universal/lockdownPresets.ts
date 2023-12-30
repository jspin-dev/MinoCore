import LockdownProviders from "../../schema/featureProviders/lockdownProviders"
import LockdownResetPolicy from "../../schema/definitions/LockdownResetPolicy"

namespace LockdownPresets {

    export const defaultMoveLimit = 15

    export const extendedPlacement = LockdownProviders.standard(LockdownResetPolicy.Move, defaultMoveLimit)

    export const infinitePlacement = LockdownProviders.standard(LockdownResetPolicy.Move)

    export const classic = LockdownProviders.standard(LockdownResetPolicy.Step)

}

export default  LockdownPresets