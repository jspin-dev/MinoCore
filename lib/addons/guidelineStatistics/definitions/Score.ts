import LockScoreAction from "./LockScoreAction"

namespace Score {

    export interface State {
        lastLockScoreAction: LockScoreAction
        score: number
        combo: number 
    }

    export interface Info {
        lockScoreActions: LockScoreAction[]
        linesToClear: number[]
        score: number
    }

    export interface UpdateResult {
        newState: State
        scoreActions: LockScoreAction[]
    }

}

export default Score;