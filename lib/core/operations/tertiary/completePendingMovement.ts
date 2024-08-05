import CoreResult from "../../definitions/CoreResult"
import GameEvent from "../../../definitions/GameEvent"
import PendingMovement from "../../definitions/PendingMovement"
import CorePreconditions from "../../utils/CorePreconditions"
import { mapOperation, passthroughOperation, sequence, withPreconditions } from "../../../util/operationUtils"
import { addEvent, updateCoreState } from "../../utils/coreOperationUtils";

const rootOperation = mapOperation(({ state }: CoreResult) => {
    const { pendingMovement, activePiece, dasCharged } = state
    if (!pendingMovement) {
        return passthroughOperation
    }
    let event: GameEvent
    switch (pendingMovement.classifier) {
        case PendingMovement.Classifier.Drop:
            event = GameEvent.Drop({ dy: pendingMovement.dy, dropType: pendingMovement.type })
            break
        case PendingMovement.Classifier.Shift:
            const direction = pendingMovement.direction
            const dasToWall = dasCharged[direction] && activePiece.availableShiftDistance[direction] == 0
            event = GameEvent.Shift({ direction, dx: pendingMovement.dx, dasToWall })
    }
    return sequence(updateCoreState({ pendingMovement: null }), addEvent(event))
})

export default withPreconditions({
    operationName: "completePendingMovement",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame]
})