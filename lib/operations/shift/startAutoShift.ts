import Operation from "../../definitions/CoreOperation";
import { SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";
import { findInstantShiftDistance } from "../../util/stateUtils";

let charge = Operation.Draft(({ state }) => { 
    if (state.meta.direction == ShiftDirection.Right) {
        state.meta.dasRightCharged = true;
    } else if (state.meta.direction == ShiftDirection.Left) {
        state.meta.dasLeftCharged = true;
    }
})

let requestStartAutoShiftTimer = Operation.Draft(({ sideEffectRequests }) => {
    sideEffectRequests.push(SideEffectRequest.TimerOperation(TimerName.AutoShift, TimerOperation.Start))
})

let conditionalShift = Operation.Provide (({ state }, { operations }) => {
    return state.settings.arr == 0 ? operations.shift(findInstantShiftDistance(state)) : requestStartAutoShiftTimer
})

export default Operation.Util.requireActiveGame(Operation.Sequence(charge, conditionalShift));
