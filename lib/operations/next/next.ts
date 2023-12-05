import GameEvent from "../../definitions/GameEvent";
import Operation from "../../definitions/CoreOperation";

export default Operation.Provide((_, { operations }) => {
    let dequeuedPiece: number;
    let dequeuePiece = Operation.Draft(({ state, events }) => { 
        dequeuedPiece = state.preview.queue.shift() 
        events.push(GameEvent.Dequeue(dequeuedPiece, state.preview.queue))
    })
    return Operation.Sequence(            
        dequeuePiece,
        operations.enqueueNext,
        operations.syncPreviewGrid,
        Operation.Provide(() => operations.spawn(dequeuedPiece))
    )   
})