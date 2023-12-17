import Operation from "../../definitions/CoreOperation"

let exportedOperation = (enabled: boolean) => {
    return Operation.Resolve((_, { operations }) => Operation.Sequence(
        Operation.Draft(({ state }) => { state.settings.ghostEnabled = enabled }),
        enabled ? operations.refreshGhost : operations.clearGhost
    ))
}

export default exportedOperation;