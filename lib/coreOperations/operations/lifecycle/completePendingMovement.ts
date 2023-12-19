import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import Step from "../../definitions/Step";
import ShiftDirection from "../../../definitions/ShiftDirection";

export default Operation.Draft(({ state, events }) => {
    let { pendingMovement, activePiece, dasLeftCharged, dasRightCharged } = state;
    switch (pendingMovement?.classifier) {
        case PendingMovement.Classifier.SoftDrop:
            let dropStep = activePiece.availableDropDistance == 0 ? Step.DropStep.SoftDropToFloor : Step.DropStep.SoftDrop;
            events.push(GameEvent.Drop(pendingMovement.dy, dropStep));
            break;
        case PendingMovement.Classifier.LeftShift:
            let dasLeftToWall = dasLeftCharged && activePiece.availableShiftDistance[ShiftDirection.Left] == 0;
            events.push(GameEvent.Shift(ShiftDirection.Left, pendingMovement.dx, dasLeftToWall));
            break;
        case PendingMovement.Classifier.RightShift:
            let dasRightToWall = dasRightCharged && activePiece.availableShiftDistance[ShiftDirection.Right] == 0;
            events.push(GameEvent.Shift(ShiftDirection.Right, pendingMovement.dx, dasRightToWall));
    }
    state.pendingMovement = null;
})