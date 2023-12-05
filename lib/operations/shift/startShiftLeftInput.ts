import Operation from "../../definitions/CoreOperation"
import PendingMovement from "../../definitions/PendingMovement"
import { ShiftDirection } from "../../definitions/playfieldDefinitions"

export default Operation.requireActiveGame(
    Operation.Provide((_, { operations }) => Operation.Sequence(draftChanges, operations.startDAS))
)

// Why are we just setting DAS right charged to true?
let draftChanges = Operation.Draft(({ state }) => { 
    state.meta.pendingMovement = PendingMovement.LeftShift(0);
    state.meta.direction = ShiftDirection.Left
    if (!state.settings.dasInteruptionEnabled) {
        state.meta.dasRightCharged = true;
    }
})
