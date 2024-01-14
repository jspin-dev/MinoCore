import Operation from "../../../definitions/CoreOperation"

const rootOperation = Operation.Resolve((_, { operations }) => {
    return Operation.Sequence(operations.refreshGhost)
})

export default Operation.Export({
    operationName: "refresh",
    rootOperation
})