import GameStatus from "../../definitions/GameStatus"
import TimerName from "../../definitions/TimerName"
import GameEvent from "../../../definitions/GameEvent"
import DropType from "../../../definitions/DropType"
import CoreOperation from "../../definitions/CoreOperation"
import { mapOperation, sequence } from "../../../util/operationUtils"
import { addEvent, mapFromOperations, updateCoreState, delayOperation } from "../../utils/coreOperationUtils"

const tickClock: CoreOperation = mapOperation(() => delayOperation({
    timerName: TimerName.Clock,
    delayInMillis: 1000,
    operation: sequence(addEvent(GameEvent.ClockTick), tickClock)
}))

const startAutoDrop: CoreOperation = mapOperation(({ state }, { operations }) => {
    return delayOperation({
        timerName: TimerName.Drop,
        delayInMillis: state.settings.dropMechanics.autoInterval,
        operation: sequence(operations.drop(DropType.Auto, 1), startAutoDrop)
    })
})

// noinspection JSUnusedGlobalSymbols
export default mapFromOperations(operations => sequence(
    updateCoreState({ status: GameStatus.Active }),
    tickClock,
    startAutoDrop,
    operations.next
))