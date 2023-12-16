import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import Step from "../../definitions/Step";
import { onFloor, findInstantShiftDistance } from "../../util/stateUtils";
import ShiftDirection from "../../definitions/ShiftDirection";
import GameSchema from "../../definitions/GameSchema";

export default (schema: GameSchema) => Operation.Draft(({ state, events }) => {
    let { pendingMovement, activePiece, playfieldGrid, direction } = state;
    let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
    switch (pendingMovement?.classifier) {
        case PendingMovement.Classifier.SoftDrop:
            let dropStep = onFloor(collisionPrereqisites) ? Step.DropStep.SoftDropToFloor : Step.DropStep.SoftDrop;
            events.push(GameEvent.Drop(pendingMovement.dy, dropStep));
            break;
        case PendingMovement.Classifier.LeftShift:
            let dasLeftToWall = state.dasLeftCharged && findInstantShiftDistance(direction, collisionPrereqisites) == 0;
            events.push(GameEvent.Shift(ShiftDirection.Left, pendingMovement.dx, dasLeftToWall));
            break;
        case PendingMovement.Classifier.RightShift:
            let dasRightToWall = state.dasRightCharged && findInstantShiftDistance(direction, collisionPrereqisites) == 0;
            events.push(GameEvent.Shift(ShiftDirection.Right, pendingMovement.dx, dasRightToWall));
    }
    state.pendingMovement = null;
})