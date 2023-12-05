import Operation from "../../definitions/CoreOperation";
import { LockdownStatus } from "../../definitions/lockdownDefinitions";
import { onFloor } from "../../util/stateUtils";

export default Operation.Util.requireActiveGame(
    Operation.Provide(({ state }, { operations }) => {
        let trigger = Operation.Draft(({ state }) => { state.playfield.lockdownInfo.status = LockdownStatus.Triggered });
        return onFloor(state) ? operations.lock : trigger;
    })
)