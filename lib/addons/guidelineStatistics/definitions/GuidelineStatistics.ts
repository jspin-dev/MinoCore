import CoreStatistics from "../../definitions/CoreStatistics"
import Grid from "../../../definitions/Grid"
import Cell from "../../../definitions/Cell"
import LockScoreAction from "./LockScoreAction"

interface GuidelineStatistics extends CoreStatistics {
    scoreState: GuidelineStatistics.ScoreState,
    level: number,
    actionTally: Record<string, number>,
    finesse: number,
    moveCount: number,
    rotationReferenceGrid: Grid<Cell> | null
}

namespace GuidelineStatistics {

    export interface ScoreState {

        lastLockScoreAction: LockScoreAction
        score: number
        combo: number

    }

    export const initial: GuidelineStatistics = {
        ...CoreStatistics.initial,
        level: 1,
        finesse: 0,
        scoreState: { lastLockScoreAction: null, score: 0, combo: -1 },
        actionTally: {},
        moveCount: 0,
        rotationReferenceGrid: null
    }
    
}

export default GuidelineStatistics