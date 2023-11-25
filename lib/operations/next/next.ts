import Operation from "../../definitions/Operation";
import { spawn } from "../spawn";
import syncPreviewGrid from "./syncPreviewGrid";

export default Operation.Provide((_, dependencies) => {
    return Operation.Sequence(            
        Operation.Draft(draft => { draft.preview.dequeuedPiece = draft.preview.queue.shift() }),
        dependencies.queueRandomizer.enqueueNext,
        syncPreviewGrid,
        Operation.Provide(state => spawn(state.preview.dequeuedPiece))
    )
})

