import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";
import PieceIdentifier from "../../definitions/PieceIdentifier";

export default Operation.Provide((_, { operations }) => {
    let dequeuedPieceId: PieceIdentifier;
    let dequeuePiece = Operation.Draft(({ state, events }) => { 
        dequeuedPieceId = state.previewQueue.shift(); 
        events.push(GameEvent.Dequeue(dequeuedPieceId, state.previewQueue))
    })
    return Operation.Sequence(            
        dequeuePiece,
        operations.enqueueNext,
        Operation.Provide(() => operations.spawn(dequeuedPieceId))
    )   
})