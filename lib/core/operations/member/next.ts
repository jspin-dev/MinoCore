import GameEvent from "../../../definitions/GameEvent"
import Operation from "../../definitions/CoreOperation"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import CorePreconditions from "../../utils/CorePreconditions"

let rootOperation = Operation.Resolve((_, { operations }) => {
    let dequeuedPieceId: PieceIdentifier
    let draftDequeue = Operation.Draft(({ state, events }) => { 
        dequeuedPieceId = state.previewQueue.shift()
        events.push(GameEvent.Dequeue(dequeuedPieceId, state.previewQueue))
    })
    return Operation.Sequence(            
        draftDequeue,
        operations.refillQueue,
        Operation.Resolve(() => operations.spawn(dequeuedPieceId))
    )   
})

export default Operation.Export({
    operationName: "next",
    preconditions: [ CorePreconditions.activeGame ],
    rootOperation
})