import Operation from "../../definitions/Operation";

export default Operation.Provide((_, { operations }) => {
    let dequeuedPiece: number;
    return Operation.Sequence(            
        Operation.Draft(({ state }) => { dequeuedPiece = state.preview.queue.shift() }),
        operations.enqueueNext,
        operations.syncPreviewGrid,
        // Dummy provider here so that we can properly pass the newly dequeued piece into the spawn function
        Operation.Provide(() => operations.spawn(dequeuedPiece))
    )   
})