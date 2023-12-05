import { Immutable } from "immer"
import { Score } from "./scoring/Score"
import GameEvent from "./GameEvent"
import { Grid } from "./shared/Grid"

export type Statistics = {
    scoreState: Score.State,
    level: number,
    actionTally: {[key: string]: number},
    lines: number,
    keysPressed: number,
    piecesLocked: number,
    time: number,
    pps: number,
    kpp: number,
    finesse: number,
    moveCount: number,
    rotationReferenceGrid: Grid
}

export namespace Statistics {

    export let initial: Statistics = {
        level: 1,
        lines: 0,
        keysPressed: 0,
        piecesLocked: 0,
        time: 0,
        kpp: 0,
        pps: 0,
        finesse: 0,
        scoreState: {
            lastLockScoreAction: null,
            score: 0,
            combo: -1
        },
        actionTally: {},
        moveCount: 0,
        rotationReferenceGrid: null
    }

}