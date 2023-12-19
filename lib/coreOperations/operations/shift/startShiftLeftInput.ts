import Operation from "../../definitions/CoreOperation"
import PendingMovement from "../../definitions/PendingMovement"
import ShiftDirection from "../../../definitions/ShiftDirection";

export default Operation.Util.requireActiveGame(
    Operation.Resolve((_, { operations }) => Operation.Sequence(draftChanges, operations.startDAS))
)

// Why are we just setting DAS right charged to true?
let draftChanges = Operation.Draft(({ state }) => { 
    state.pendingMovement = PendingMovement.LeftShift(0);
    state.direction = ShiftDirection.Left
    if (!state.settings.dasInteruptionEnabled) {
        state.dasRightCharged = true;
    }
})
