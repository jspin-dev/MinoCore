import CoreResult from "../../../definitions/CoreResult"
import GameEvent from "../../../../definitions/GameEvent"
import PendingMovement from "../../../definitions/PendingMovement"
import CorePreconditions from "../../../utils/CorePreconditions"
import { withPreconditions } from "../../../../util/reducerUtils"

const rootReducer = ({ state, events }: CoreResult) => {
    const { pendingMovement, activePiece, dasCharged } = state
    let event: GameEvent
    switch (pendingMovement?.classifier) {
        case PendingMovement.Classifier.Drop:
            event = GameEvent.Drop({ dy: pendingMovement.dy, dropType: pendingMovement.type })
            break
        case PendingMovement.Classifier.Shift:
            const direction = pendingMovement.direction
            const dasToWall = dasCharged[direction] && activePiece.availableShiftDistance[direction] == 0
            event = GameEvent.Shift({ direction, dx: pendingMovement.dx, dasToWall })
    }
    return {
        state: { ...state, pendingMovement: null as PendingMovement },
        events: [ ...events, event]
    }
}

export default withPreconditions({
    reducerName: "completePendingMovement",
    reduce: rootReducer,
    preconditions: [ CorePreconditions.activeGame ]
})