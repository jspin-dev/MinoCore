import Operation from "../../definitions/CoreOperation";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";
import { findInstantShiftDistance } from "../../util/stateUtils";

let invertDirection = Operation.Provide(({ state }) => {
    if (!state.settings.dasInteruptionEnabled || !state.meta.dasLeftCharged) {
        return Operation.None;
    }
    let provideInstantShift = Operation.Provide(({ state }, { operations }) => {
        return Operation.applyIf(state.settings.arr === 0, operations.shift(findInstantShiftDistance(state)))
    })
    let setShiftDirectionLeft = Operation.Draft(({ state }) => { state.meta.direction = ShiftDirection.Left });
    return Operation.Sequence(setShiftDirectionLeft, provideInstantShift);
})

let conditionalCancelAutoShift = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(state.meta.direction == ShiftDirection.Right, operations.cancelAutoShift)
})

export default Operation.requireActiveGame(
    Operation.Sequence(
        Operation.Draft(({ state }) => { state.meta.dasRightCharged = false }), 
        invertDirection, 
        conditionalCancelAutoShift
    )
)