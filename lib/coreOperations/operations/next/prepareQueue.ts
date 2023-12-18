import Operation from "../../definitions/CoreOperation"

export default Operation.Resolve((_, { operations }) => Operation.Sequence(    
    Operation.Draft(({ state }) => { state.previewQueue = [] }),
    operations.refillQueue
))