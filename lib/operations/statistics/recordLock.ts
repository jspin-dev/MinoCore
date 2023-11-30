import Operation from "../../definitions/Operation";
import { Score } from "../../definitions/scoring/Score";
import { LockScoreAction, ScoreCalculationInfo } from "../../definitions/scoring/scoringDefinitions";
import { Grid } from "../../definitions/shared/Grid";
import { Playfield, Statistics, StepCounts } from "../../definitions/stateTypes";
import { Step, StepType } from "../../definitions/steps";
import finesseSettings from "../../rotationSystems/finesseSettings";
import { calculatePPS, detectPC, detectTspin } from "../../util/stateUtils";

export default (lines: number, spinSnapshot: Readonly<Grid>) => Operation.Provide(({ state }) => {
    let { playfield, statistics, settings } = state;
    let action = getScoreAction(lines, playfield, spinSnapshot);
    let scoreCalculationInfo = { 
        comboBonusEnabled: settings.scoreConfig.comboBonusEnabled, 
        level: statistics.level, 
        lines 
    }
    let scoreState = createNewScoreStateOnLock(action, statistics.scoreState, scoreCalculationInfo);
    let finesse = calculateFinesseOnLock(playfield, statistics);
    return updateStats(action, scoreState, lines, finesse);
})

let updateStats = (
    action: LockScoreAction, 
    scoreState: Score.State,
    lines: number,
    finesse: number
) => Operation.Draft(({ state }) => {
    let statistics = state.statistics;
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
})

let calculateFinesseOnLock = (playfield: Playfield, statistics: Statistics): number => {
    let coordinates = playfield.activePiece.coordinates;
    let index = coordinates.reduce((a, value) => value.x < a ? value.x : a, coordinates[0].x);
    let idealSteps = finesseSettings
        .find(set => set.pieces.includes(playfield.activePiece.id))
        .info
        .find(info => info.orientations.includes(playfield.activePiece.orientation))
        .steps[index];
    let idealStepCounts = getStepCountBreakdown(idealSteps);
    if (statistics.steps.drop > 0) { // Unable to provide finesse if the user soft drops
        return 0;
    }
    let rotationFinesse = Math.max(statistics.steps.rotate - idealStepCounts.rotate, 0);
    let shiftFinesse = Math.max(statistics.steps.shift - idealStepCounts.shift, 0);
    return rotationFinesse + shiftFinesse;
}

let getStepCountBreakdown = (steps: Step[]): StepCounts => {
    let initialValues = {
        [StepType.Drop]: 0,
        [StepType.Rotate]: 0,
        [StepType.Shift]: 0,
        [StepType.Hold]: 0
    };
    return steps.reduce((values, step) => {
        return {...values, [step.type]: values[step.type] + 1 }
    }, initialValues);
}

let getScoreAction = (lines: number, playfield: Playfield, spinSnapshot: Readonly<Grid>): LockScoreAction => {
    if (detectPC(playfield)) {
        return LockScoreAction.PC(lines);
    }
    if (spinSnapshot != null) {
        let tspinType = detectTspin(playfield.activePiece, spinSnapshot);
        switch (tspinType) {
            case LockScoreAction.Type.TSpin:
                return LockScoreAction.TSpin(lines);
            case LockScoreAction.Type.TSpinMini:
                return LockScoreAction.TSpinMini(lines);
        }
    }
    return lines > 0 ? LockScoreAction.LineClear(lines) : null;
}

let createNewScoreStateOnLock = (
    action: LockScoreAction, 
    previousState: Score.State,
    scoreInfo: ScoreCalculationInfo
): Score.State => {
    let combo = scoreInfo.lines > 0 ? previousState.combo + 1 : -1;
    if (!action) {
        return { ...previousState, combo };
    }
    let actionInfo = LockScoreAction.defaultGuidelineScoringTable[action.key];
    let previousActionInfo = previousState.lastLockScoreAction 
        ? LockScoreAction.defaultGuidelineScoringTable[previousState.lastLockScoreAction.key] 
        : null;
    let b2b = previousActionInfo 
        && !previousActionInfo.breaksB2b 
        && previousActionInfo.difficult 
        && actionInfo.difficult;
    let b2bMultiplier = b2b ? actionInfo.b2bMultiplyer : 1;
    let comboScore = scoreInfo.comboBonusEnabled && combo > 0 ? 50 * combo * scoreInfo.level : 0;
    return {
        lastLockScoreAction: action,
        score: previousState.score + (actionInfo.basePointValue * b2bMultiplier) + comboScore,
        combo
    }
} 