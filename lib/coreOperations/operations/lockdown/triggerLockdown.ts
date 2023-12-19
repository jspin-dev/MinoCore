import Operation from "../../definitions/CoreOperation";
import LockdownStatus from "../../definitions/LockdownStatus";

export default Operation.Util.requireActiveGame(
    Operation.Resolve(({ state }, { operations }) => {
        let draftTriggerStatus = Operation.Draft(({ state }) => { state.lockdownInfo.status = LockdownStatus.Triggered });
        return state.activePiece.availableDropDistance == 0 ? operations.lock : draftTriggerStatus;
    })
)