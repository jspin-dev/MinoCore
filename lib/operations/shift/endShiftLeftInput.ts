import Operation from "../../definitions/CoreOperation";
import ShiftDirection from "../../definitions/ShiftDirection";
import { findInstantShiftDistance } from "../../util/stateUtils";

let invertDirection = Operation.Provide(({ state }) => {
    if (!state.settings.dasInteruptionEnabled || !state.dasRightCharged) {
        return Operation.None;
    }
    let provideInstantShift = Operation.Provide(({ state }, { operations, schema }) => {
        let { activePiece, playfieldGrid, direction, settings } = state;
        let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
        if (settings.arr === 0) {
            return operations.shift(findInstantShiftDistance(direction, collisionPrereqisites));
        } else {
            return Operation.None;
        }
    })
    let setShiftDirectionRight = Operation.Draft(({ state }) => { state.direction = ShiftDirection.Right });
    return Operation.Sequence(setShiftDirectionRight, provideInstantShift)
})

let conditionalCancelAutoShift = Operation.Provide(({ state }, { operations }) => {
    return operations.cancelAutoShift.applyIf(state.direction == ShiftDirection.Left);
})

export default Operation.Util.requireActiveGame(
    Operation.Sequence(
        Operation.Draft(({ state }) => { state.dasLeftCharged = false }), 
        invertDirection, 
        conditionalCancelAutoShift
    )
)