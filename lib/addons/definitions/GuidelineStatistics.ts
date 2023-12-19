import CoreStatistics from "./CoreStatistics"
import Score from "./Score"
import Grid from "../../definitions/Grid"
import Cell from "../../definitions/Cell"

interface GuidelineStatistics extends CoreStatistics {
    scoreState: Score.State,
    level: number,
    actionTally: {[key: string]: number},
    finesse: number,
    moveCount: number,
    rotationReferenceGrid: Grid<Cell>
}

namespace GuidelineStatistics {

    export let initial: GuidelineStatistics = {
        ...CoreStatistics.initial,
        level: 1,
        finesse: 0,
        scoreState: { lastLockScoreAction: null, score: 0, combo: -1 },
        actionTally: {},
        moveCount: 0,
        rotationReferenceGrid: null
    }
    
}

export default GuidelineStatistics;