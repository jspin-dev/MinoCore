import Operation from "../../definitions/CoreOperation";

export default Operation.Resolve(({ state }, { operations }) => {
    return Operation.Sequence(operations.drop(state.activePiece.availableDropDistance), operations.lock)
})

