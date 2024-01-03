import GameEvent from "../../../../definitions/GameEvent"
import Operation from "../../../definitions/CoreOperation"
import PendingMovement from "../../../definitions/PendingMovement"

export default Operation.Draft(({ state, events }) => {
    let { pendingMovement, activePiece, dasCharged } = state
    switch (pendingMovement?.classifier) {
        case PendingMovement.Classifier.Drop:
            events.push(GameEvent.Drop({ dy: pendingMovement.dy, dropType: pendingMovement.type }))
            break;
        case PendingMovement.Classifier.Shift:
            let direction = pendingMovement.direction
            let dasToWall = dasCharged[direction] && activePiece.availableShiftDistance[direction] == 0
            events.push(GameEvent.Shift({ direction, dx: pendingMovement.dx, dasToWall }))
    }
    state.pendingMovement = null
})