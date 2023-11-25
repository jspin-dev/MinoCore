import Operation from "../../definitions/Operation"

export default  Operation.Sequence(    
    Operation.Draft(draft => { draft.preview.queue = [] }),
    Operation.Provide((_, depencencies) => depencencies.queueRandomizer.enqueueFull)
)