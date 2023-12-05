import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import { Input } from "../../definitions/inputDefinitions";
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions";
import completePendingMovement from "./completePendingMovement";

/**
 * Called when a user input ends. Usually this would be the release of a keypress
 */
export default (input: Input.ActiveGame) => Operation.Sequence(
    completePendingMovement,
    recordInputEnd(input),
    provideInputEndAction(input)
)

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
    state.meta.activeInputs = state.meta.activeInputs.filter(i => i != input)
    events.push(GameEvent.InputEnd(input));
})

let cancelSoftDrop = Operation.Draft(({ state, sideEffectRequests }) => {
    let { meta, settings } = state;
    meta.softDropActive = false;
    sideEffectRequests.push(SideEffectRequest.TimerInterval(TimerName.AutoDrop, settings.dropInterval))
})
