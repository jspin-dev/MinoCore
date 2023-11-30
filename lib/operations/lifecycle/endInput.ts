import GameEvent from "../../definitions/GameEvent";
import InputResult from "../../definitions/InputResult";
import Operation from "../../definitions/Operation";
import { Input } from "../../definitions/inputDefinitions";
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions";
import { Step } from "../../definitions/steps";

/**
 * Called when a user input ends. Usually this would be the release of a keypress
 */
export default (input: Input.ActiveGame) => Operation.Sequence( 
    removeInput(input),
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

let removeInput = (input: Input.ActiveGame) => Operation.Draft(({ state }) => {
    state.meta.activeInputs = state.meta.activeInputs.filter(i => i != input)
})

let cancelSoftDrop = Operation.Draft(({ state, events, sideEffectRequests }) => {
    let { meta, settings } = state;
    meta.softDropActive = false;
    meta.activeRightShiftDistance = 0;

    let inputResult = InputResult.Drop(meta.activeDropDistance, Step.DropStep.SoftDrop);
    events.push(GameEvent.InputResult(inputResult));

    sideEffectRequests.push(SideEffectRequest.TimerInterval(TimerName.AutoDrop, settings.dropInterval))
})
