import GameEvent from "../../../../definitions/GameEvent"
import Operation from "../../../definitions/CoreOperation"
import PendingMovement from "../../../definitions/PendingMovement"

export default Operation.Draft(({ state, events }) => {
    let { pendingMovement, activePiece, dasCharged } = state
    switch (pendingMovement?.classifier) {
        case PendingMovement.Classifier.Drop:
            events.push(GameEvent.Drop(pendingMovement.dy, pendingMovement.type))
            break;
        case PendingMovement.Classifier.Shift:
            let direction = pendingMovement.direction
            let dasLeftToWall = dasCharged[direction] && activePiece.availableShiftDistance[direction] == 0
            events.push(GameEvent.Shift(direction, pendingMovement.dx, dasLeftToWall))
    }
    state.pendingMovement = null
})