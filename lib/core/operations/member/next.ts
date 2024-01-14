import GameEvent from "../../../definitions/GameEvent"
import Operation from "../../definitions/CoreOperation"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import CorePreconditions from "../../utils/CorePreconditions"

const rootOperation = Operation.Resolve((_, { operations }) => {
    let dequeuedPiece: PieceIdentifier
    const draftDequeue = Operation.Draft(({ state, events }) => {
        dequeuedPiece = state.previewQueue.shift()
        events.push(GameEvent.Dequeue({ dequeuedPiece, preview: state.previewQueue }))
    })
    return Operation.Sequence(            
        draftDequeue,
        operations.refillQueue,
        Operation.Resolve(() => operations.spawn(dequeuedPiece))
    )   
})

export default Operation.Export({
    operationName: "next",
    preconditions: [ CorePreconditions.activeGame ],
    rootOperation
})