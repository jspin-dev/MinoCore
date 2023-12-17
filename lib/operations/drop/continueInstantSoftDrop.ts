import Operation from "../../definitions/CoreOperation"
import { findInstantDropDistance, shouldContinueInstantSoftDrop } from "../../util/stateUtils"

export default Operation.Resolve(({ state }, { operations, schema }) => {
    let { activePiece, playfieldGrid } = state;
    let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
    if (shouldContinueInstantSoftDrop(state, schema.playfield)) {
        return operations.drop(findInstantDropDistance(collisionPrereqisites))
    } else {
        return Operation.None;
    }
})
