import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import ShiftDirection from "../../definitions/ShiftDirection";

export default Operation.Util.requireActiveGame(
    Operation.Resolve((_, { operations }) => Operation.Sequence(draftChanges, operations.startDAS))
)

// Why are we just setting DAS left charged to true?
let draftChanges = Operation.Draft(({ state }) => { 
    state.pendingMovement = PendingMovement.RightShift(0);
    state.direction = ShiftDirection.Right;
    if (!state.settings.dasInteruptionEnabled) {
        state.dasRightCharged = true;
    }
})

