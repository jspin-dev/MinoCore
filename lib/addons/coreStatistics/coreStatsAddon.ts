import GameEvent from "../../definitions/GameEvent";
import Statistics from "./definitions/CoreStatistics";
import OperationResult from "../../definitions/CoreOperationResult";
import CoreState from "../../definitions/CoreState";
import Operation from "../../definitions/Operation";

export default <S extends CoreState>(coreResult: OperationResult<S>) => {
    let operations = coreResult.events.map(event => updateStatisticsFromEvent(event));
    return Operation.Sequence(...operations)
}

let updateStatisticsFromEvent = (event: GameEvent) => {
    switch (event.classifier) {
        case GameEvent.Classifier.ClockTick:
            return onTick;
        case GameEvent.Classifier.InputStart:
            return onInputStart;
        case GameEvent.Classifier.Lock:
            return onLock(event);
        case GameEvent.Classifier.Hold:
            return onHold;
        case GameEvent.Classifier.Spawn:
            return onSpawn;
        default:
            return Operation.None();
    }
}

let onTick = Operation.Draft<Statistics>(statistics => {
    statistics.time++;
    statistics.pps = statistics.time ? statistics.piecesLocked / statistics.time : 0;
})

let onHold = Operation.Draft<Statistics>(statistics => {
    statistics.holdCount++;
})

let onSpawn = Operation.Draft<Statistics>(statistics => {
    statistics.spawnCount++;
})

let onInputStart = Operation.Draft<Statistics>(statistics => {
    statistics.keysPressed++;
    statistics.kpp = statistics.piecesLocked ? statistics.keysPressed / statistics.piecesLocked : 0;
})

let onLock = (event: GameEvent.LockType) => Operation.Draft<Statistics>(statistics => {
    statistics.pps = statistics.time ? statistics.piecesLocked / statistics.time : 0;
    statistics.lines += event.linesCleared.length;
    statistics.piecesLocked++;
})

