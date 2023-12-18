import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import Step from "../../definitions/Step";
import ShiftDirection from "../../definitions/ShiftDirection";
import GameSchema from "../../../schemas/definitions/GameSchema";
import { findInstantShiftDistance } from "../../utils/coreOpStateUtils";

export default (schema: GameSchema) => Operation.Draft(({ state, events }) => {
    let { pendingMovement, activePiece, playfieldGrid, direction } = state;
    switch (pendingMovement?.classifier) {
        case PendingMovement.Classifier.SoftDrop:
            let dropStep = activePiece.distanceToFloor == 0 ? Step.DropStep.SoftDropToFloor : Step.DropStep.SoftDrop;
            events.push(GameEvent.Drop(pendingMovement.dy, dropStep));
            break;
        case PendingMovement.Classifier.LeftShift:
            let dasLeftToWall = state.dasLeftCharged 
                && findInstantShiftDistance(direction, activePiece, playfieldGrid, schema.playfield) == 0;
            events.push(GameEvent.Shift(ShiftDirection.Left, pendingMovement.dx, dasLeftToWall));
            break;
        case PendingMovement.Classifier.RightShift:
            let dasRightToWall = state.dasRightCharged 
                && findInstantShiftDistance(direction, activePiece, playfieldGrid, schema.playfield) == 0;
            events.push(GameEvent.Shift(ShiftDirection.Right, pendingMovement.dx, dasRightToWall));
    }
    state.pendingMovement = null;
})