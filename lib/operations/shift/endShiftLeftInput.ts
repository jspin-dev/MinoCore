;import GameEvent from "../../definitions/GameEvent";
import InputResult from "../../definitions/InputResult";
import Operation from "../../definitions/Operation";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";

let invertDirection = Operation.Provide(({ state }) => {
    if (!state.settings.dasInteruptionEnabled || !state.meta.dasRightCharged) {
        return Operation.None;
    }
    let provideInstantShift = Operation.Provide(({ state }, { operations }) => {
        return Operation.applyIf(state.settings.arr === 0, operations.instantShift)
    })
    let setShiftDirectionRight = Operation.Draft(({ state }) => { state.meta.direction = ShiftDirection.Right });
    return Operation.Sequence(setShiftDirectionRight, provideInstantShift)
})

let conditionalCancelAutoShift = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(state.meta.direction == ShiftDirection.Left, operations.cancelAutoShift)
})

let draftChanges = Operation.Draft(({ state, events }) => { 
    state.meta.dasLeftCharged = false;
    state.meta.activeLeftShiftDistance = 0;

    let inputResult = InputResult.Shift(ShiftDirection.Left, state.meta.activeLeftShiftDistance, true);
    events.push(GameEvent.InputResult(inputResult));
})

export default Operation.SequenceStrict(draftChanges, invertDirection, conditionalCancelAutoShift)