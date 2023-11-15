import { LockScoreAction } from "./scoringDefinitions"

export namespace Score {

    export type State = {
        lastLockScoreAction: LockScoreAction,
        score: number,
        combo: number 
    }

    export type Info = {
        lockScoreActions: LockScoreAction[],
        linesToClear: number[],
        score: number
    }

    export type UpdateResult = {
        newState: State,
        scoreActions: LockScoreAction[]
    }

}