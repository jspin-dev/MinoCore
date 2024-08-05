import GameEvent from "../../../definitions/GameEvent"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreDependencies from "../../definitions/CoreDependencies"
import CoreResult from "../../definitions/CoreResult"
import { mapOperation, sequence, withPreconditions } from "../../../util/operationUtils"
import { addEvent, updateCoreState } from "../../utils/coreOperationUtils"

const rootOperation = mapOperation((result: CoreResult, { operations }: CoreDependencies) => {
    const dequeuedPiece = result.state.previewQueue.at(0)
    const updatedQueue =  result.state.previewQueue.slice(1)
    return sequence(
        updateCoreState({ previewQueue: updatedQueue, holdEnabled: true }),
        addEvent(GameEvent.Dequeue({ dequeuedPiece, preview: updatedQueue })),
        operations.refillQueue,
        operations.spawn(dequeuedPiece)
    )
})

export default withPreconditions({
    operationName: "next",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame]
})
