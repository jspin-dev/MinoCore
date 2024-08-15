import GameEvent from "../../definitions/GameEvent"
import DropType from "../../definitions/DropType"
import GuidelineStatistics from "./definitions/GuidelineStatistics"
import Operation from "../../definitions/Operation"
import Grid from "../../definitions/Grid"
import Cell from "../../definitions/Cell"
import LockScoreAction from "./definitions/LockScoreAction"
import ActivePiece from "../../definitions/ActivePiece"
import TetroPiece from "../../presets/tetro/TetroPiece"
import Input from "../../definitions/Input"
import Rotation from "../../definitions/Rotation"
import { detectPC, detectTspin } from "./guidelineScoringUtils"
import updateCoreStatistics from "../coreStatistics/coreStatsAddon"
import {passthroughOperation, sequence} from "../../util/operationUtils"
import finesseSettings from "./finesseSettings"

type StatisticsOperation = Operation<GuidelineStatistics, void>

// noinspection JSUnusedGlobalSymbols
export default (statistics: GuidelineStatistics, gameEvents: GameEvent[]) => {
    const operations = gameEvents.map(event => updateStatisticsFromEvent(event))
    const coreStatisticsOperation = (statistics: GuidelineStatistics) => updateCoreStatistics(statistics, gameEvents)
    return sequence(coreStatisticsOperation, ...operations)(statistics)
}

const updateStatisticsFromEvent = (event: GameEvent) => {
    switch (event.classifier) {
        case GameEvent.Classifier.Drop:
            return onDrop(event)
        case GameEvent.Classifier.InputStart:
            return onInputStart(event)
        case GameEvent.Classifier.PlayfieldReduction:
            return onPlayfieldReduction(event)
        case GameEvent.Classifier.Shift:
            return onShift
        case GameEvent.Classifier.Rotate:
            return onRotation(event)
        default:
            return passthroughOperation
    }
}

const onDrop: (event: GameEvent.Types.Drop) => StatisticsOperation = event => {
    const dropMultipliers = {
        [DropType.Auto]: 0,
        [DropType.Soft]: 1,
        [DropType.Hard]: 2
    }
    return statistics => {
        return {
            rotationReferenceGrid: null as Grid<Cell>,
            scoreState: {
                ...statistics.scoreState,
                score: statistics.scoreState.score + dropMultipliers[event.dropType] * event.dy
            }
        }
    }
}

const onShift: StatisticsOperation = () => {
    return {
        rotationReferenceGrid: null as Grid<Cell>
    }
}

const onRotation: (event: GameEvent.Types.Rotate) => StatisticsOperation = event => {
    return () => {
        return {
            rotationReferenceGrid: event.previousPlayfield
        }
    }
}

const onInputStart: (event: GameEvent.Types.InputStart) => StatisticsOperation = event => {
    return statistics => {
        switch (event.input.classifier) {
            case Input.ActiveGame.Classifier.Shift:
                return { moveCount: statistics.moveCount + 1 }
            case Input.ActiveGame.Classifier.Rotate:
                let moveCount = event.input.rotation == Rotation.Degrees180 ? 2 : 1
                return { moveCount: statistics.moveCount + moveCount }
        }
    }
}

const onPlayfieldReduction: (event: GameEvent.Types.PlayfieldReduction) => StatisticsOperation = event => {
    return statistics => {
        const lines = event.linesCleared.length
        const finesse = statistics.finesse + calculateFinesseOnLock(statistics, event.activePiece)
        const action = getScoreAction(lines, event.activePiece, event.playfield, statistics.rotationReferenceGrid)
        const scoreState = createNewScoreState(action, statistics.scoreState, statistics.level, lines)
        const moveCount = 0

        let actionTally: Record<string, number>
        if (action) {
            const tally = action.key in statistics.actionTally ? statistics.actionTally[action.key] + 1 : 1
            actionTally = { ...statistics.actionTally, [action.key]: tally }
        } else {
            actionTally = statistics.actionTally
        }

        return { lines, finesse, scoreState, moveCount, actionTally }
    }
}

const calculateFinesseOnLock = (statistics: GuidelineStatistics, activePiece: ActivePiece) => {
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

const createNewScoreState = (
    action: LockScoreAction,
    previousState: GuidelineStatistics.ScoreState,
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
    } satisfies GuidelineStatistics.ScoreState
}
