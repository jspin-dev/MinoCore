import Operation from "../../definitions/CoreOperation";
import LockdownStatus from "../../definitions/LockdownStatus";
import { onFloor } from "../../util/stateUtils";

export default Operation.Util.requireActiveGame(
    Operation.Provide(({ state }, { operations, schema }) => {
        let { activePiece, playfieldGrid } = state;
        let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
        let trigger = Operation.Draft(({ state }) => { state.lockdownInfo.status = LockdownStatus.Triggered });
        return onFloor(collisionPrereqisites) ? operations.lock : trigger;
    })
)