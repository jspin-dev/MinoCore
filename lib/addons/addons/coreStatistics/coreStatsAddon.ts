import GameEvent from "../../../definitions/GameEvent"
import type Statistics from "../../definitions/CoreStatistics"
import Operation from "../../../definitions/Operation"

export default (gameEvents: GameEvent[]) => {
    let operations = gameEvents.map(event => updateStatisticsFromEvent(event))
    return Operation.Sequence(...operations)
}

let updateStatisticsFromEvent = (event: GameEvent) => {
    switch (event.classifier) {
        case GameEvent.Classifier.ClockTick:
            return onTick
        case GameEvent.Classifier.InputStart:
            return onInputStart
        case GameEvent.Classifier.Lock:
            return onLock(event)
        case GameEvent.Classifier.Hold:
            return onHold
        case GameEvent.Classifier.Spawn:
            return onSpawn
        default:
            return Operation.None()
    }
}

let onTick = Operation.Draft<Statistics>(statistics => {
    statistics.time++
    statistics.pps = statistics.time ? statistics.piecesLocked / statistics.time : 0
})

let onHold = Operation.Draft<Statistics>(statistics => {
    statistics.holdCount++
})

let onSpawn = Operation.Draft<Statistics>(statistics => {
    statistics.spawnCount++
})

let onInputStart = Operation.Draft<Statistics>(statistics => {
    statistics.keysPressed++
    statistics.kpp = statistics.piecesLocked ? statistics.keysPressed / statistics.piecesLocked : 0
})

let onLock = (event: GameEvent.Types.Lock) => Operation.Draft<Statistics>(statistics => {
    statistics.pps = statistics.time ? statistics.piecesLocked / statistics.time : 0
    statistics.lines += event.linesCleared.length
    statistics.piecesLocked++
})

