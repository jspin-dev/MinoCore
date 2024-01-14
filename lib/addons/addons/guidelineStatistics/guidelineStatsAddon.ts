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
import Rotation from "../../../definitions/Rotation"
import finesseSettings from "./finesseSettings"
import { detectPC, detectTspin } from "./guidelineScoringUtils"
import updateCoreStatistics from "../coreStatistics/coreStatsAddon"

export default (gameEvents: GameEvent[]) => {
    const operations = gameEvents.map(event => updateStatisticsFromEvent(event))
    return Operation.Sequence(updateCoreStatistics(gameEvents), ...operations)
}

const dropMultipliers = {
    [DropType.Auto]: 0,
    [DropType.Soft]: 1,
    [DropType.Hard]: 2
}

const updateStatisticsFromEvent = (event: GameEvent) => {
    switch (event.classifier) {
        case GameEvent.Classifier.Drop:
            return onDrop(event)
        case GameEvent.Classifier.InputStart:
            return onInputStart(event)
        case GameEvent.Classifier.Clear:
            return onClear(event)
        case GameEvent.Classifier.Shift:
            return onShift()
        case GameEvent.Classifier.Rotate:
            return onRotation(event)
        default:
            return Operation.None()
    }
}

const onDrop = (event: GameEvent.Types.Drop) => Operation.Draft<Statistics>(statistics => {
    statistics.scoreState.score += dropMultipliers[event.dropType] * event.dy
    statistics.rotationReferenceGrid = null
})

const onShift = () => Operation.Draft<Statistics>(statistics => {
    statistics.rotationReferenceGrid = null
})

const onRotation = (event: GameEvent.Types.Rotate) => Operation.Draft<Statistics>(statistics => {
    statistics.rotationReferenceGrid = event.previousPlayfield
})

const onInputStart = (event: GameEvent.Types.InputStart) => Operation.Draft<Statistics>(statistics => {
    switch (event.input.classifier) {
        case Input.ActiveGame.Classifier.Shift:
            statistics.moveCount += 1
            break
        case Input.ActiveGame.Classifier.Rotate:
            statistics.moveCount += event.input.rotation == Rotation.Degrees180 ? 2 : 1
    }
})

const onClear = (event: GameEvent.Types.Clear) => Operation.Draft<Statistics>(statistics => {
    const lines = event.linesCleared.length
    statistics.finesse += calculateFinesseOnLock(statistics, event.activePiece)
    const action = getScoreAction(lines, event.activePiece, event.playfield, statistics.rotationReferenceGrid)
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

const calculateFinesseOnLock = (statistics: Statistics, activePiece: ActivePiece) => {
    const coordinates = activePiece.coordinates
    const index = coordinates.reduce((a, value) => value.x < a ? value.x : a, coordinates[0].x)
    const idealSteps = finesseSettings
        .find(set => set.pieces.includes(activePiece.id as TetroPiece))
        .info
        .find(info => info.orientations.includes(activePiece.orientation))
        .steps[index]
    return Math.max(statistics.moveCount - idealSteps.length, 0)
}

const getScoreAction = (
    lines: number, 
    activePiece: ActivePiece, 
    playfieldGrid: Grid<Cell>, 
    rotationReferenceGrid?: Grid<Cell>
) => {
    if (lines > 0 && detectPC(playfieldGrid)) {
        return LockScoreAction.PC(lines)
    }
    if (rotationReferenceGrid != null) {
        const tspinType = detectTspin(activePiece, rotationReferenceGrid)
        switch (tspinType) {
            case LockScoreAction.Type.TSpin:
                return LockScoreAction.TSpin(lines)
            case LockScoreAction.Type.TSpinMini:
                return LockScoreAction.TSpinMini(lines)
        }
    }
    const returnValue = lines > 0 ? LockScoreAction.LineClear(lines) : null
    return returnValue satisfies LockScoreAction
}

const createNewScoreStateOnLock = (
    action: LockScoreAction, 
    previousState: ScoreState,
    level: number,
    lines: number
) => {
    const combo = lines > 0 ? previousState.combo + 1 : -1
    if (!action) {
        return { ...previousState, combo }
    }
    const actionInfo = LockScoreAction.defaultGuidelineScoringTable[action.key]
    const previousActionInfo = previousState.lastLockScoreAction
        ? LockScoreAction.defaultGuidelineScoringTable[previousState.lastLockScoreAction.key] 
        : null
    const b2b = previousActionInfo && !previousActionInfo.breaksB2b && previousActionInfo.difficult && actionInfo.difficult
    const b2bMultiplier = b2b ? actionInfo.b2bMultiplyer : 1
    const comboScore = combo > 0 ? 50 * combo * level : 0
    return {
        lastLockScoreAction: action,
        score: previousState.score + (actionInfo.basePointValue * b2bMultiplier) + comboScore,
        combo
    } satisfies ScoreState
}
