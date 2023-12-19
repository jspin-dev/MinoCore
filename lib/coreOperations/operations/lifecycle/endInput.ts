import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import Input from "../../definitions/Input";
import completePendingMovement from "./completePendingMovement";
import SideEffect from "../../definitions/SideEffect";

/**
 * Called when a user input ends. Usually this would be the release of a keypress
 */
export default (input: Input.ActiveGame) => Operation.Resolve((_, { schema }) => Operation.Sequence(
    completePendingMovement,
    draftInputEndRecord(input),
    resolveInputEndAction(input)
))

let resolveInputEndAction = (input: Input.ActiveGame) => Operation.Resolve((_, { operations }) => {
    switch(input) {
        case Input.ActiveGame.ShiftRight:
            return operations.endShiftRightInput;
        case Input.ActiveGame.ShiftLeft:
            return operations.endShiftLeftInput;
        case Input.ActiveGame.SD:
            return draftSoftDropCancel;
        default:
            return Operation.None;
    }
})

let draftInputEndRecord = (input: Input.ActiveGame) => Operation.Draft(({ state, events }) => {
    state.activeInputs = state.activeInputs.filter(i => i != input)
    events.push(GameEvent.InputEnd(input));
})

let draftSoftDropCancel = Operation.Draft(({ state, sideEffectRequests }) => {
    state.softDropActive = false;
    sideEffectRequests.push(SideEffect.Request.TimerInterval(SideEffect.TimerName.AutoDrop, state.settings.dropInterval))
})
