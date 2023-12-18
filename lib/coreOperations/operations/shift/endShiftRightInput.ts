import Operation from "../../definitions/CoreOperation";
import ShiftDirection from "../../definitions/ShiftDirection";
import { findInstantShiftDistance } from "../../utils/coreOpStateUtils";

let resolveDirection = Operation.Resolve(({ state }) => {
    if (!state.settings.dasInteruptionEnabled || !state.dasLeftCharged) {
        return Operation.None;
    }
    let resolveInstantShift = Operation.Resolve(({ state }, { operations, schema }) => {
        let { activePiece, playfieldGrid, direction } = state;
        if (state.settings.arr === 0) {
            return operations.shift(findInstantShiftDistance(direction, activePiece, playfieldGrid, schema.playfield));
        } else {
            return Operation.None;
        }
    })
    let draftShiftDirection = Operation.Draft(({ state }) => { state.direction = ShiftDirection.Left });
    return Operation.Sequence(draftShiftDirection, resolveInstantShift);
})

let resolveAutoShift = Operation.Resolve(({ state }, { operations }) => {
    return operations.cancelAutoShift.applyIf(state.direction == ShiftDirection.Right)
})

export default Operation.Util.requireActiveGame(
    Operation.Sequence(
        Operation.Draft(({ state }) => { state.dasRightCharged = false }), 
        resolveDirection, 
        resolveAutoShift
    )
)