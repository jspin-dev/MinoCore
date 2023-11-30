import GameEvent from "../../definitions/GameEvent";
import InputResult from "../../definitions/InputResult";
import Operation from "../../definitions/Operation";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";

let invertDirection = Operation.Provide(({ state }) => {
    if (!state.settings.dasInteruptionEnabled || !state.meta.dasLeftCharged) {
        return Operation.None;
    }
    let provideInstantShift = Operation.Provide(({ state }, { operations }) => {
        return Operation.applyIf(state.settings.arr === 0, operations.instantShift)
    })
    let setShiftDirectionLeft = Operation.Draft(({ state }) => { state.meta.direction = ShiftDirection.Left });
    return Operation.Sequence(setShiftDirectionLeft, provideInstantShift);
})

let conditionalCancelAutoShift = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(state.meta.direction == ShiftDirection.Right, operations.cancelAutoShift)
})

let draftChanges = Operation.Draft(({ state, events }) => { 
    state.meta.dasRightCharged = false 
    state.meta.activeRightShiftDistance = 0

    let inputResult = InputResult.Shift(ShiftDirection.Right, state.meta.activeRightShiftDistance, true)
    events.push(GameEvent.InputResult(inputResult))
})

export default Operation.SequenceStrict(
    draftChanges,
    invertDirection, 
    conditionalCancelAutoShift
)