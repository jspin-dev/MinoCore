import Operation from "../../definitions/CoreOperation";
import { findInstantShiftDistance, shouldContinueInstantShift } from "../../util/stateUtils";

export default Operation.Provide(({ state }, { operations, schema }) => {
    let { activePiece, playfieldGrid, direction } = state;
    let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
    if (shouldContinueInstantShift(state, schema.playfield)) {
        return operations.shift(findInstantShiftDistance(direction, collisionPrereqisites))
    } else {
        return Operation.None;
    }
})