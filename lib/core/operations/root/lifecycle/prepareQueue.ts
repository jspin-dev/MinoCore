import Operation from "../../../definitions/CoreOperation"

let rootOperation = Operation.Resolve((_, { operations }) => Operation.Sequence(
    Operation.Draft(({ state }) => { state.previewQueue = [] }),
    operations.refillQueue
))

export default Operation.Export({ operationName: "prepareQueue", rootOperation })