import LockdownConfig from "./LockdownConfig";

interface Settings {
    ghostEnabled: boolean
    dasPreservationEnabled: boolean
    nextPreviewSize: number
    softDropInterval: number
    dropInterval: number
    dasInteruptionEnabled: boolean
    dasPreIntervalShift: boolean
    arr: number
    das: number
    lockdownConfig: LockdownConfig
}

namespace Settings {

    export namespace Presets {

        export const Guideline = {
            ghostEnabled: true,
            dasPreservationEnabled: true,
            nextPreviewSize: 5,
            softDropInterval: 10,
            dropInterval: 500000,
            dasInteruptionEnabled: true,
            dasPreIntervalShift: true,
            arr: 10,
            das: 130,
            lockdownConfig: LockdownConfig.Presets.ExtendedPlacement
        }  

    }

}

export default Settings;