import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";
import { Step } from "../../definitions/steps";
import { onFloor, findInstantShiftDistance } from "../../util/stateUtils";

export default Operation.Draft(({ state, events }) => {
    let pendingMovement = state.meta.pendingMovement;
    switch (pendingMovement?.classifier) {
        case PendingMovement.Classifier.SoftDrop:
            let dropStep = onFloor(state) ? Step.DropStep.SoftDropToFloor : Step.DropStep.SoftDrop;
            events.push(GameEvent.Drop(pendingMovement.dy, dropStep));
            break;
        case PendingMovement.Classifier.LeftShift:
            let dasLeftToWall = state.meta.dasLeftCharged && findInstantShiftDistance(state) == 0;
            events.push(GameEvent.Shift(ShiftDirection.Left, pendingMovement.dx, dasLeftToWall));
            break;
        case PendingMovement.Classifier.RightShift:
            let dasRightToWall = state.meta.dasRightCharged && findInstantShiftDistance(state) == 0;
            events.push(GameEvent.Shift(ShiftDirection.Right, pendingMovement.dx, dasRightToWall));
    }
    state.meta.pendingMovement = null;
})