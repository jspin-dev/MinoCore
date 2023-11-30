import Operation from "../../definitions/Operation"

export default Operation.Provide((_, { operations }) => Operation.Sequence(    
    Operation.Draft(({ state }) => { state.preview.queue = [] }),
    operations.enqueueFull
))