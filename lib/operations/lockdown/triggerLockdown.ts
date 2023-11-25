import Operation from "../../definitions/Operation";
import { LockdownStatus } from "../../definitions/lockdownDefinitions";
import { onFloor } from "../../util/stateUtils";
import lock from "./lock";

export default Operation.ProvideStrict(state => {
    let trigger = Operation.Draft(draft => { draft.playfield.lockdownInfo.status = LockdownStatus.Triggered });
    return onFloor(state) ? lock : trigger;
})