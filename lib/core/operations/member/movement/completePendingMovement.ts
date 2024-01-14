import GameEvent from "../../../../definitions/GameEvent"
import Operation from "../../../definitions/CoreOperation"
import PendingMovement from "../../../definitions/PendingMovement"

export default Operation.Draft(({ state, events }) => {
    const { pendingMovement, activePiece, dasCharged } = state
    switch (pendingMovement?.classifier) {
        case PendingMovement.Classifier.Drop:
            events.push(GameEvent.Drop({ dy: pendingMovement.dy, dropType: pendingMovement.type }))
            break
        case PendingMovement.Classifier.Shift:
            const direction = pendingMovement.direction
            const dasToWall = dasCharged[direction] && activePiece.availableShiftDistance[direction] == 0
            events.push(GameEvent.Shift({ direction, dx: pendingMovement.dx, dasToWall }))
    }
    state.pendingMovement = null
})