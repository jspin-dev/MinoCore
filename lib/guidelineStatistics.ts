import GameEvent from "./definitions/GameEvent";
import { Statistics } from "./definitions/Statistics";
import { LockScoreAction, ScoreCalculationInfo, dropScoreMultipliers } from "./definitions/scoring/scoringDefinitions";
import { ScoreConfig, Settings } from "./definitions/settingsDefinitions";
import { calculateKPP, calculatePPS, detectPC, detectTspin } from "./util/stateUtils";
import { Input } from "./definitions/inputDefinitions";
import { ActivePiece } from "./definitions/playfieldDefinitions";
import finesseSettings from "./rotationSystems/finesseSettings";
import { Grid } from "./definitions/shared/Grid";
import { Score } from "./definitions/scoring/Score";
import { CoreOperationResult as OperationResult } from "./definitions/CoreOperationResult";
import CoreState from "./definitions/CoreState";
import Operation from "./definitions/Operation";

type StatisticsOperation = Operation<Statistics, void>

export let updateStatistics = <S extends CoreState>(coreResult: OperationResult<S>) => {
    let operations = coreResult.events.map(event => updateStatisticsFromEvent(event, coreResult.state.settings));
    return Operation.Sequence(...operations)
}

let moveCounts = {
    [Input.ActiveGame.SD]: 0,
    [Input.ActiveGame.HD]: 0,
    [Input.ActiveGame.Hold]: 0,
    [Input.ActiveGame.ShiftLeft]: 1,
    [Input.ActiveGame.ShiftRight]: 1,
    [Input.ActiveGame.RotateCW]: 1,
    [Input.ActiveGame.RotateCCW]: 1,
    [Input.ActiveGame.Rotate180]: 2
}

let updateStatisticsFromEvent = (event: GameEvent, settings: Settings) => {
    switch (event.classifier) {
        case GameEvent.Classifier.ClockTick:
            return onTick;
        case GameEvent.Classifier.Drop:
            return onDrop(event);
        case GameEvent.Classifier.InputStart:
            return onInputStart(event);
        case GameEvent.Classifier.Lock:
            return onLock(event, settings.scoreConfig);
        case GameEvent.Classifier.Shift:
            return onShift(event);
        case GameEvent.Classifier.Rotate:
            return onRotation(event);
        default:
            return Operation.None();
    }
}

let onTick: StatisticsOperation = Operation.Draft(statistics => {
    statistics.time++;
    statistics.pps = calculatePPS(statistics);
})

let onDrop = (event: GameEvent.DropType) => Operation.Draft<Statistics>(statistics => {
    statistics.scoreState.score += dropScoreMultipliers[event.dropType] * event.dy;
    if (event.dy > 0) {
        statistics.rotationReferenceGrid = null;
    }
})

let onShift = (event: GameEvent.ShiftType) => Operation.Draft<Statistics>(statistics => {
    if (event.dx > 0) {
        statistics.rotationReferenceGrid = null;
    }
})

let onRotation = (event: GameEvent.RotateType) => Operation.Draft<Statistics>(statistics => {
    statistics.rotationReferenceGrid = event.previousPlayfield;
})

let onInputStart = (event: GameEvent.InputStartType) => Operation.Draft<Statistics>(statistics => {
    statistics.keysPressed++;
    statistics.kpp = calculateKPP(statistics);
    statistics.moveCount += moveCounts[event.input];
})

let onLock = (event: GameEvent.LockType, scoreConfig: ScoreConfig) => {
    return Operation.Draft<Statistics>(statistics => {
        let lines = event.linesCleared.length;
        statistics.finesse += calculateFinesseOnLock(statistics, event.activePiece)
        let action = getScoreAction(lines, event.activePiece, event.playfield, statistics.rotationReferenceGrid);
        let scoreCalculationInfo = { comboBonusEnabled: scoreConfig.comboBonusEnabled, level: statistics.level, lines }
        statistics.scoreState = createNewScoreStateOnLock(action, statistics.scoreState, scoreCalculationInfo);
        statistics.pps = calculatePPS(statistics);
        statistics.lines += event.linesCleared.length;
        statistics.piecesLocked++;
        statistics.moveCount = 0;
        if (action) {
            if (action.key in statistics.actionTally) {
                statistics.actionTally[action.key]++;
            } else {
                statistics.actionTally[action.key] = 1;
            }
        }
    })
}

let calculateFinesseOnLock = <T extends Statistics>(statistics: T, activePiece: ActivePiece): number => {
    let coordinates = activePiece.coordinates;
    let index = coordinates.reduce((a, value) => value.x < a ? value.x : a, coordinates[0].x);
    let idealSteps = finesseSettings
        .find(set => set.pieces.includes(activePiece.id))
        .info
        .find(info => info.orientations.includes(activePiece.orientation))
        .steps[index];
    return Math.max(statistics.moveCount - idealSteps.length, 0)
}

let getScoreAction = (
    lines: number, 
    activePiece: ActivePiece, 
    playfieldGrid: Grid, 
    rotationReferenceGrid?: Grid
): LockScoreAction => {
    if (detectPC(playfieldGrid)) {
        return LockScoreAction.PC(lines);
    }
    if (rotationReferenceGrid != null) {
        let tspinType = detectTspin(activePiece, rotationReferenceGrid);
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