import Operation from "../../definitions/Operation";
import { Input } from "../../definitions/inputDefinitions";
import { Rotation } from "../../definitions/rotationDefinitions";
import hardDrop from "../drop/hardDrop";
import startSoftDrop from "../drop/startSoftDrop";
import hold from "../hold";
import rotate from "../rotation/rotate";
import startShiftLeftInput from "../shift/startShiftLeftInput";
import startShiftRightInput from "../shift/startShiftRightInput";
import recordInput from "../statistics/recordInput";

export default (input: Input.ActiveGame) => Operation.Provide(({ meta }) => {
    if (meta.activeInputs.includes(input)) {
        return Operation.None;
    }
    return Operation.Sequence(
        Operation.Draft(draft => { draft.meta.activeInputs.push(input) }),
        performInputAction(input),
        recordInput
    );
})

let performInputAction = (input: Input.ActiveGame): Operation.Any => {
    switch (input) {
        case Input.ActiveGame.ShiftLeft:
            return startShiftLeftInput
        case Input.ActiveGame.ShiftRight:
            return startShiftRightInput;
        case Input.ActiveGame.SD:
            return startSoftDrop;
        case Input.ActiveGame.HD:
            return hardDrop;
        case Input.ActiveGame.Hold:
            return hold;
        case Input.ActiveGame.RotateCW:
            return rotate(Rotation.CW);
        case Input.ActiveGame.RotateCCW:
            return rotate(Rotation.CCW);
        case Input.ActiveGame.Rotate180:
            return rotate(Rotation.Degrees180);
        default:
            return Operation.None
    }
}
