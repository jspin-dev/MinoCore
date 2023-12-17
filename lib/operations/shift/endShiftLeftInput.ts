import Operation from "../../definitions/CoreOperation";
import ShiftDirection from "../../definitions/ShiftDirection";
import { findInstantShiftDistance } from "../../util/stateUtils";

let resolveDirection = Operation.Resolve(({ state }) => {
    if (!state.settings.dasInteruptionEnabled || !state.dasRightCharged) {
        return Operation.None;
    }
    let resolveInstantShift = Operation.Resolve(({ state }, { operations, schema }) => {
        let { activePiece, playfieldGrid, direction, settings } = state;
        let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
        if (settings.arr === 0) {
            return operations.shift(findInstantShiftDistance(direction, collisionPrereqisites));
        } else {
            return Operation.None;
        }
    })
    let draftShiftDirection = Operation.Draft(({ state }) => { state.direction = ShiftDirection.Right });
    return Operation.Sequence(draftShiftDirection, resolveInstantShift)
})

let resolveAutoShift = Operation.Resolve(({ state }, { operations }) => {
    return operations.cancelAutoShift.applyIf(state.direction == ShiftDirection.Left);
})

export default Operation.Util.requireActiveGame(
    Operation.Sequence(
        Operation.Draft(({ state }) => { state.dasLeftCharged = false }), 
        resolveDirection, 
        resolveAutoShift
    )
)