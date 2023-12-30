import GameEvent from "../../../../definitions/GameEvent"
import Operation from "../../../definitions/CoreOperation"

export default Operation.Export({
    operationName: "recordTick",
    rootOperation: Operation.Draft(({ events }) => { events.push(GameEvent.ClockTick()) })
})