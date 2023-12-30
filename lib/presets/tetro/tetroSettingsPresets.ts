import Settings from "../../core/definitions/Settings"

interface SettingPresets {
    guideline: Settings
}

let settings: SettingPresets = {
    guideline: {
        ghostEnabled: true,
        softDropInterval: 10,
        dropInterval: 1000,
        das: {
            preservationEnabled: true,
            interruptionEnabled: true,
            postDelayShiftEnabled: true,
            autoShiftInterval: 10,
            delay: 130
        }
    }
}
export default settings