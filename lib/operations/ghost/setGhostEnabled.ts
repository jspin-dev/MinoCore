import Operation from "../../definitions/Operation"

let exportedOperation = (enabled: boolean) => {
    return Operation.Provide((_, { operations }) => Operation.Sequence(
        Operation.Draft(({ state }) => { state.settings.ghostEnabled = enabled }),
        enabled ? operations.refreshGhost : operations.clearGhost
    ))
}

export default exportedOperation;