import {  DropScoreType, LockScoreAction, dropScoreMultipliers } from "../definitions/scoringDefinitions";
import { StepType } from "../types/steps";
import { calculateFinesseOnLock } from "./finesse";
import { getScoreAction, createNewScoreStateOnLock } from "./scoring";
import { Statistics } from "../types/stateTypes";
import { Grid } from "../types/sharedTypes";

export let updateStatsOnClock: Drafter = {
    draft: draft => {
        draft.statistics.time++;
        draft.statistics.pps = calculatePPS(draft.statistics);
    }
}

export let updateStatsOnInput: Drafter = {
    draft: draft => {
        draft.statistics.keysPressed++;
        draft.statistics.kpp = calculateKPP(draft.statistics);
    }
}

export let updateStatsOnDrop = (dropScoreType: DropScoreType, n: number): Drafter => {
    return {
        draft: draft => {
            draft.statistics.scoreState.score += dropScoreMultipliers[dropScoreType] * n;
        }
    }
}

export namespace UpdateStatsOnLock {

    let draftStats = (
        action: LockScoreAction, 
        scoreState: Score.State,
        lines: number,
        finesse: number
    ): Drafter => {
        return {
            draft: ({ statistics }) => {
                if (action) {
                    if (action.key in statistics.actionTally) {
                        statistics.actionTally[action.key]++;
                    } else {
                        statistics.actionTally[action.key] = 1;
                    }
                }
                statistics.scoreState = scoreState;
                statistics.lines += lines;
                statistics.finesse += finesse;
                statistics.steps = {
                    [StepType.Drop]: 0,
                    [StepType.Rotate]: 0,
                    [StepType.Shift]: 0,
                    [StepType.Hold]: 0
                }
                statistics.piecesLocked++;
                statistics.pps = calculatePPS(statistics);
                statistics.pps = calculatePPS(statistics);
            }
        }  
    }

    export let provider = (lines: number, spinSnapshot: Readonly<Grid>): Provider => {
        return {
            provide: ({ playfield, statistics, settings }) => {
                let action = getScoreAction(lines, playfield, spinSnapshot);
                let scoreCalculationInfo = { 
                    comboBonusEnabled: settings.scoreConfig.comboBonusEnabled, 
                    level: statistics.level, 
                    lines 
                }
                let scoreState = createNewScoreStateOnLock(action, statistics.scoreState, scoreCalculationInfo);
                let finesse = calculateFinesseOnLock(playfield, statistics);
                return draftStats(action, scoreState, lines, finesse);
            }
        }
    }

}

let calculateKPP = (statistics: Statistics): number => {
    return statistics.piecesLocked ? statistics.keysPressed / statistics.piecesLocked : 0;
}

let calculatePPS = (statistics: Statistics): number => {
    return statistics.time ? statistics.piecesLocked / statistics.time : 0;
}