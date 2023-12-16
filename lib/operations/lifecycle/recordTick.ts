import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";

export default Operation.Draft(({ events }) => {
    events.push(GameEvent.ClockTick())
})
