import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";
import recordStep from "../statistics/recordStep";

export default Operation.ProvideStrict((_, { operations }) => Operation.Sequence(
    draftChanges,
    operations.startDAS,
    recordStep(MovementType.Shift)
))

// Why are we just setting DAS left charged to true?
let draftChanges = Operation.Draft(({ state }) => { 
    state.meta.direction = ShiftDirection.Right;
    state.meta.activeRightShiftDistance = 0;
    if (!state.settings.dasInteruptionEnabled) {
        state.meta.dasRightCharged = true;
    }
})