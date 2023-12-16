import Operation from "../../definitions/CoreOperation"

export default Operation.Provide((_, { operations }) => Operation.Sequence(    
    Operation.Draft(({ state }) => { state.previewQueue = [] }),
    operations.enqueueFull
))