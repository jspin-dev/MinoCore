import GameEvent from "../../../definitions/GameEvent"
import Statistics from "../../definitions/GuidelineStatistics"
import Input from "../../../definitions/Input"
import Grid from "../../../definitions/Grid"
import Operation from "../../../definitions/Operation"
import LockScoreAction from "../../definitions/LockScoreAction"
import ActivePiece from "../../../definitions/ActivePiece"
import Cell from "../../../definitions/Cell"
import TetroPiece from "../../../presets/tetro/TetroPiece"
import ScoreState from "../../definitions/Score"
import DropType from "../../../definitions/DropType"
import finesseSettings from "./finesseSettings"
import {detectPC, detectTspin} from "./guidelineScoringUtils"
import updateCoreStatistics from "../coreStatistics/coreStatsAddon"
import Rotation from "../../../definitions/Rotation";

export default (gameEvents: GameEvent[]) => {
    let operations = gameEvents.map(event => updateStatisticsFromEvent(event));
    return Operation.Sequence(updateCoreStatistics(gameEvents), ...operations)
}

let dropMultipliers = {
    [DropType.Auto]: 0,
    [DropType.Soft]: 1,
    [DropType.Hard]: 2
}

let updateStatisticsFromEvent = (event: GameEvent) => {
    switch (event.classifier) {
        case GameEvent.Classifier.Drop:
            return onDrop(event);
        case GameEvent.Classifier.InputStart:
            return onInputStart(event);
        case GameEvent.Classifier.Lock:
            return onLock(event);
        case GameEvent.Classifier.Shift:
            return onShift();
        case GameEvent.Classifier.Rotate:
            return onRotation(event);
        default:
            return Operation.None();
    }
}

let onDrop = (event: GameEvent.Types.Drop) => Operation.Draft<Statistics>(statistics => {
    statistics.scoreState.score += dropMultipliers[event.dropType] * event.dy
    statistics.rotationReferenceGrid = null
})

let onShift = () => Operation.Draft<Statistics>(statistics => {
    statistics.rotationReferenceGrid = null
})

let onRotation = (event: GameEvent.Types.Rotate) => Operation.Draft<Statistics>(statistics => {
    statistics.rotationReferenceGrid = event.previousPlayfield
})

let onInputStart = (event: GameEvent.Types.InputStart) => Operation.Draft<Statistics>(statistics => {
    switch (event.input.classifier) {
        case Input.ActiveGame.Classifier.Shift:
            statistics.moveCount += 1
            break
        case Input.ActiveGame.Classifier.Rotate:
            statistics.moveCount += event.input.rotation == Rotation.Degrees180 ? 2 : 1
    }
})

let onLock = (event: GameEvent.Types.Lock) => {
    return Operation.Draft<Statistics>(statistics => {
        let lines = event.linesCleared.length
        statistics.finesse += calculateFinesseOnLock(statistics, event.activePiece)
        let action = getScoreAction(lines, event.activePiece, event.playfield, statistics.rotationReferenceGrid)
        statistics.scoreState = createNewScoreStateOnLock(action, statistics.scoreState, statistics.level, lines)
        statistics.moveCount = 0
        if (action) {
            if (action.key in statistics.actionTally) {
                statistics.actionTally[action.key]++
            } else {
                statistics.actionTally[action.key] = 1
            }
        }
    })
}

let calculateFinesseOnLock = (statistics: Statistics, activePiece: ActivePiece): number => {
    let coordinates = activePiece.coordinates;
    let index = coordinates.reduce((a, value) => value.x < a ? value.x : a, coordinates[0].x);
    let idealSteps = finesseSettings
        .find(set => set.pieces.includes(activePiece.id as TetroPiece))
        .info
        .find(info => info.orientations.includes(activePiece.orientation))
        .steps[index];
    return Math.max(statistics.moveCount - idealSteps.length, 0)
}

let getScoreAction = (
    lines: number, 
    activePiece: ActivePiece, 
    playfieldGrid: Grid<Cell>, 
    rotationReferenceGrid?: Grid<Cell>
): LockScoreAction => {
    if (lines > 0 && detectPC(playfieldGrid)) {
        return LockScoreAction.PC(lines)
    }
    if (rotationReferenceGrid != null) {
        let tspinType = detectTspin(activePiece, rotationReferenceGrid)
        switch (tspinType) {
            case LockScoreAction.Type.TSpin:
                return LockScoreAction.TSpin(lines)
            case LockScoreAction.Type.TSpinMini:
                return LockScoreAction.TSpinMini(lines)
        }
    }
    return lines > 0 ? LockScoreAction.LineClear(lines) : null
}

let createNewScoreStateOnLock = (
    action: LockScoreAction, 
    previousState: ScoreState,
    level: number,
    lines: number
): ScoreState => {
    let combo = lines > 0 ? previousState.combo + 1 : -1;
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
    let comboScore = combo > 0 ? 50 * combo * level : 0;
    return {
        lastLockScoreAction: action,
        score: previousState.score + (actionInfo.basePointValue * b2bMultiplier) + comboScore,
        combo
    }
}
