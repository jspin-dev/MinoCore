import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import Input from "../../definitions/Input";
import completePendingMovement from "./completePendingMovement";
import SideEffect from "../../definitions/SideEffect";

/**
 * Called when a user input ends. Usually this would be the release of a keypress
 */
export default (input: Input.ActiveGame) => Operation.Provide((_, { schema }) => Operation.Sequence(
    completePendingMovement(schema),
    recordInputEnd(input),
    provideInputEndAction(input)
))

let provideInputEndAction = (input: Input.ActiveGame) => Operation.Provide((_, { operations }) => {
    switch(input) {
        case Input.ActiveGame.ShiftRight:
            return operations.endShiftRightInput;
        case Input.ActiveGame.ShiftLeft:
            return operations.endShiftLeftInput;
        case Input.ActiveGame.SD:
            return cancelSoftDrop;
        default:
            return Operation.None;
    }
})

let recordInputEnd = (input: Input.ActiveGame) => Operation.Draft(({ state, events }) => {
    state.activeInputs = state.activeInputs.filter(i => i != input)
    events.push(GameEvent.InputEnd(input));
})

let cancelSoftDrop = Operation.Draft(({ state, sideEffectRequests }) => {
    state.softDropActive = false;
    sideEffectRequests.push(SideEffect.Request.TimerInterval(SideEffect.TimerName.AutoDrop, state.settings.dropInterval))
})
