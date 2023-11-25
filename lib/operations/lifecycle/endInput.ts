import Operation from "../../definitions/Operation";
import { Input } from "../../definitions/inputDefinitions";
import cancelSoftDrop from "../drop/cancelSoftDrop";
import endShiftLeftInput from "../shift/endShiftLeftInput";
import endShiftRightInput from "../shift/endShiftRightInput";

/**
 * Called when a user input ends. Usually this would be the release of a keypress
 */
export default (input: Input.ActiveGame) => Operation.Sequence( 
    removeInput(input),
    provideInputEndAction(input)
)

let provideInputEndAction = (input: Input.ActiveGame): Operation.Any => {
    switch(input) {
        case Input.ActiveGame.ShiftRight:
            return endShiftRightInput;
        case Input.ActiveGame.ShiftLeft:
            return endShiftLeftInput;
        case Input.ActiveGame.SD:
            return cancelSoftDrop;
        default:
            return Operation.None;
    }
}

let removeInput = (input: Input.ActiveGame) => Operation.Draft(draft => {
    draft.meta.activeInputs = draft.meta.activeInputs.filter(i => i != input)
})
