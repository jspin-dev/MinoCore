import Dependencies from "../../definitions/Dependencies";
import Operation from "../../definitions/Operation";
import { Input } from "../../definitions/inputDefinitions";
import { Rotation } from "../../definitions/rotationDefinitions";
import { State } from "../../definitions/stateTypes";
import recordInput from "../statistics/recordInput";

export default (input: Input.ActiveGame) => Operation.Provide(({ state }, depencencies) => {
    if (state.meta.activeInputs.includes(input)) {
        return Operation.None;
    }
    return Operation.Sequence(
        Operation.Draft(({ state }) => { state.meta.activeInputs.push(input) }),
        performInputAction(input, depencencies),
        recordInput
    );
})

let performInputAction = <S extends State>(input: Input.ActiveGame, { operations }: Dependencies<S>): Operation<S> => {
    switch (input) {
        case Input.ActiveGame.ShiftLeft:
            return operations.startShiftLeftInput
        case Input.ActiveGame.ShiftRight:
            return operations.startShiftRightInput;
        case Input.ActiveGame.SD:
            return operations.startSoftDrop;
        case Input.ActiveGame.HD:
            return operations.hardDrop;
        case Input.ActiveGame.Hold:
            return operations.hold;
        case Input.ActiveGame.RotateCW:
            return operations.rotate(Rotation.CW);
        case Input.ActiveGame.RotateCCW:
            return operations.rotate(Rotation.CCW);
        case Input.ActiveGame.Rotate180:
            return operations.rotate(Rotation.Degrees180);
        default:
            return Operation.None;
    }
}
