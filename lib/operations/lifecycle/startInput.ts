import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import Input from "../../definitions/Input";
import completePendingMovement from "./completePendingMovement";
import CoreDependencies from "../../definitions/CoreDependencies";
import Rotation from "../../definitions/Rotation";

export default (input: Input.ActiveGame) => Operation.Resolve(({ state }, depencencies) => {
    if (state.activeInputs.includes(input)) {
        return Operation.None;
    }
    return Operation.Sequence(
        completePendingMovement(depencencies.schema),
        draftInputStartRecord(input),
        performInputAction(input, depencencies)
    );
})

let draftInputStartRecord = (input: Input.ActiveGame) => Operation.Draft(({ state, events }) => { 
    state.activeInputs.push(input);
    events.push(GameEvent.InputStart(input));
})

let performInputAction = (input: Input.ActiveGame, { operations }: CoreDependencies) => {
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
