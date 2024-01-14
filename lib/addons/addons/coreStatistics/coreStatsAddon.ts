import GameEvent from "../../../definitions/GameEvent"
import type Statistics from "../../definitions/CoreStatistics"
import Operation from "../../../definitions/Operation"

export default (gameEvents: GameEvent[]) => {
    const operations = gameEvents.map(event => updateStatisticsFromEvent(event))
    return Operation.Sequence(...operations)
}

let updateStatisticsFromEvent = (event: GameEvent) => {
    switch (event.classifier) {
        case GameEvent.Classifier.ClockTick:
            return onTick
        case GameEvent.Classifier.InputStart:
            return onInputStart
        case GameEvent.Classifier.Lock:
            return onLock
        case GameEvent.Classifier.Clear:
            return onClear(event)
        case GameEvent.Classifier.Hold:
            return onHold
        case GameEvent.Classifier.Spawn:
            return onSpawn
        default:
            return Operation.None()
    }
}

const onTick = Operation.Draft<Statistics>(statistics => {
    statistics.time++
    statistics.pps = statistics.time ? statistics.piecesLocked / statistics.time : 0
})

const onHold = Operation.Draft<Statistics>(statistics => {
    statistics.holdCount++
})

const onSpawn = Operation.Draft<Statistics>(statistics => {
    statistics.spawnCount++
})

const onInputStart = Operation.Draft<Statistics>(statistics => {
    statistics.keysPressed++
    statistics.kpp = statistics.piecesLocked ? statistics.keysPressed / statistics.piecesLocked : 0
})

const onLock = Operation.Draft<Statistics>(statistics => {
    statistics.pps = statistics.time ? statistics.piecesLocked / statistics.time : 0
    statistics.piecesLocked++
})

const onClear = (event: GameEvent.Types.Clear) => Operation.Draft<Statistics>(statistics => {
    statistics.lines += event.linesCleared.length
})
