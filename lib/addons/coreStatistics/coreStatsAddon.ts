import GameEvent from "../../definitions/GameEvent"
import { passthroughOperation, sequence } from "../../util/operationUtils"
import CoreStatistics from "../definitions/CoreStatistics"
import Operation from "../../definitions/Operation"

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
        case GameEvent.Classifier.Clear:
            return updateOnClear(event)
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

const updateOnTick: Operation<CoreStatistics, void> = statistics => {
    let time = statistics.time + 1
    return {
        ...statistics,
        time: time,
        pps: statistics.time ? statistics.piecesLocked / time : 0
    }
}

const updateOnHold: Operation<CoreStatistics, void> = statistics => {
    return { holdCount: statistics.holdCount + 1 }
}

const updateOnSpawn: Operation<CoreStatistics, void> = statistics => {
    return { spawnCount: statistics.spawnCount + 1 }
}

const updateOnInputStart: Operation<CoreStatistics, void> = statistics => {
    return {
        inputCount: statistics.inputCount + 1,
        kpp: statistics.piecesLocked ? statistics.inputCount / statistics.piecesLocked : 0
    }
}

const updateOnLock: Operation<CoreStatistics, void> = statistics => {
    return {
        pps: statistics.time ? statistics.piecesLocked / statistics.time : 0,
        piecesLocked: statistics.piecesLocked + 1
    }
}

const updateOnClear: (event: GameEvent.Types.Clear) => Operation<CoreStatistics, void> = event => {
    return (statistics, _) => {
        return { lines: statistics.lines += event.linesCleared.length }
    }
}

