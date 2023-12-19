import Operation from "../../definitions/CoreOperation";
import ShiftDirection from "../../../definitions/ShiftDirection";
import SideEffect from "../../definitions/SideEffect";
import { findMaxShiftDistance } from "../../utils/coreOpStateUtils";

let draftCharge = Operation.Draft(({ state }) => { 
    if (state.direction == ShiftDirection.Right) {
        state.dasRightCharged = true;
    } else if (state.direction == ShiftDirection.Left) {
        state.dasLeftCharged = true;
    }
})

let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
    sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoShift, SideEffect.TimerOperation.Start))
})

let resolveMovement = Operation.Resolve (({ state }, { operations, schema }) => {
    let { activePiece, playfieldGrid, direction } = state;
    return state.settings.arr == 0 
        ? operations.shift(findMaxShiftDistance(direction, activePiece.coordinates, playfieldGrid, schema.playfield)) 
        : draftTimerChange;
})

export default Operation.Util.requireActiveGame(Operation.Sequence(draftCharge, resolveMovement));
