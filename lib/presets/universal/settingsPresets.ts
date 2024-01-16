import Settings from "../../settings/definitions/Settings"

interface SettingPresets {
    steady: Settings
}

export default {
    steady: {
        dasMechanics: {
            preservationEnabled: true,
            interruptionEnabled: true,
            postDelayShiftEnabled: true,
            autoShiftInterval: 30,
            delay: 130
        },
        dropMechanics: {
            softInterval: 10,
            autoInterval: 1000
        },
        ghostEnabled: true
    }
} satisfies SettingPresets