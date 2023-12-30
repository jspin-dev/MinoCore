import LockScoreAction from "./LockScoreAction"

export default interface ScoreState {

    lastLockScoreAction: LockScoreAction
    score: number
    combo: number

}
