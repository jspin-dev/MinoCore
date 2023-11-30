import Operation from "../../definitions/Operation"
import { MovementType } from "../../definitions/inputDefinitions"
import { ShiftDirection } from "../../definitions/playfieldDefinitions"
import recordStep from "../statistics/recordStep"

export default Operation.ProvideStrict((_, { operations }) => Operation.Sequence(
    draftChanges,
    operations.startDAS,
    recordStep(MovementType.Shift)
))

// Why are we just setting DAS right charged to true?
let draftChanges = Operation.Draft(({ state }) => { 
    state.meta.direction = ShiftDirection.Left
    state.meta.activeLeftShiftDistance = 0 
    if (!state.settings.dasInteruptionEnabled) {
        state.meta.dasRightCharged = true;
    }
})

