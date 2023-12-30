interface Settings {
    ghostEnabled: boolean
    softDropInterval: number
    dropInterval: number
    das: Settings.DasMechanics
}

namespace Settings {

    export interface DasMechanics {
        preservationEnabled: boolean
        interruptionEnabled: boolean
        postDelayShiftEnabled: boolean
        autoShiftInterval: number // ARR in milliseconds
        delay: number // DAS in milliseconds
    }

    export namespace DasMechanics {

        export interface Update {
            preservationEnabled?: boolean
            interruptionEnabled?: boolean
            postDelayShiftEnabled?: boolean
            autoShiftInterval?: number
            delay?: number
        }

    }

}

namespace Settings {

    export interface Update {
        ghostEnabled?: boolean
        softDropInterval?: number
        dropInterval?: number
        das?: Settings.DasMechanics.Update
    }

}

export default Settings