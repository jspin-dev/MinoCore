import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";

export default Operation.Util.requireActiveGame(
    Operation.Provide((_, { operations }) => Operation.Sequence(draftChanges, operations.startDAS))
)

// Why are we just setting DAS left charged to true?
let draftChanges = Operation.Draft(({ state }) => { 
    state.meta.pendingMovement = PendingMovement.RightShift(0);
    state.meta.direction = ShiftDirection.Right;
    if (!state.settings.dasInteruptionEnabled) {
        state.meta.dasRightCharged = true;
    }
})

