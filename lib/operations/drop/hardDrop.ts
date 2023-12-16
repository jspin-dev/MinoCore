import Operation from "../../definitions/CoreOperation";
import { findInstantDropDistance } from "../../util/stateUtils";

export default Operation.Provide(({ state }, { operations, schema }) => {
    let { activePiece, playfieldGrid } = state;
    let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
    return Operation.Sequence(
        operations.drop(findInstantDropDistance(collisionPrereqisites)),
        operations.lock
    )
})

