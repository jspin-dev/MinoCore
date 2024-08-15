import GameEvent from "../../definitions/GameEvent"
import { passthroughOperation, sequence } from "../../util/operationUtils"
import CoreStatistics from "../definitions/CoreStatistics"
import Operation from "../../definitions/Operation"
import PieceIdentifier from "../../definitions/PieceIdentifier";

type StatisticsOperation = Operation<CoreStatistics, void>

// noinspection JSUnusedGlobalSymbols
export default (statistics: CoreStatistics, gameEvents: GameEvent[]) => {
    const operations = gameEvents.map(event => updateStatisticsFromEvent(event))
    const combinedOperation = sequence(...operations)
    return combinedOperation(statistics)
}

const updateStatisticsFromEvent = (event: GameEvent) => {
    switch (event.classifier) {
        case GameEvent.Classifier.ClockTick:
            return updateOnTick
        case GameEvent.Classifier.InputStart:
            return updateOnInputStart
        case GameEvent.Classifier.Lock:
            return updateOnLock
        case GameEvent.Classifier.PlayfieldReduction:
            return updateOnReduction(event)
        case GameEvent.Classifier.Hold:
            return updateOnHold
        case GameEvent.Classifier.Spawn:
            return updateOnSpawn
        case GameEvent.Classifier.Restart:
            return () => CoreStatistics.initial
        default:
            return passthroughOperation
    }
}

const updateOnTick: StatisticsOperation = statistics => {
    let time = statistics.time + 1
    return {
        ...statistics,
        time: time,
        pps: statistics.time ? statistics.piecesLocked / time : 0
    }
}

const updateOnHold: StatisticsOperation = statistics => {
    return { holdCount: statistics.holdCount + 1 }
}

const updateOnSpawn: StatisticsOperation = statistics => {
    return { spawnCount: statistics.spawnCount + 1 }
}

const updateOnInputStart: StatisticsOperation = statistics => {
    return {
        inputCount: statistics.inputCount + 1,
        kpp: statistics.piecesLocked ? statistics.inputCount / statistics.piecesLocked : 0
    }
}

const updateOnLock: StatisticsOperation = statistics => {
    return {
        pps: statistics.time ? statistics.piecesLocked / statistics.time : 0,
        piecesLocked: statistics.piecesLocked + 1
    }
}

const updateOnReduction: (event: GameEvent.Types.PlayfieldReduction) => StatisticsOperation = event => {
    return statistics => {
        return { lines: statistics.lines += event.linesCleared.length }
    }
}
