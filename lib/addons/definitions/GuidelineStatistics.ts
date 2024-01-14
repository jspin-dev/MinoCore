import CoreStatistics from "./CoreStatistics"
import Grid from "../../definitions/Grid"
import Cell from "../../definitions/Cell"
import ScoreState from "./Score"

interface GuidelineStatistics extends CoreStatistics {
    scoreState: ScoreState,
    level: number,
    actionTally: {[key: string]: number},
    finesse: number,
    moveCount: number,
    rotationReferenceGrid: Grid<Cell>
}

namespace GuidelineStatistics {

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