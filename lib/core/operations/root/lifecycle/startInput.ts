import GameEvent from "../../../../definitions/GameEvent"
import Operation from "../../../definitions/CoreOperation"
import Input from "../../../../definitions/Input"
import type CoreDependencies from "../../../definitions/CoreDependencies"
import GameStatus from "../../../definitions/GameStatus"

let performInputAction = (input: Input.ActiveGame, { operations }: CoreDependencies) => {
    console.log(input)
    switch (input.classifier) {
        case Input.ActiveGame.Classifier.Shift:
            return operations.startShiftInput(input.direction)
        case Input.ActiveGame.Classifier.Rotate:
            return operations.rotate(input.rotation)
        case Input.ActiveGame.Classifier.SD:
            return operations.startSoftDrop
        case Input.ActiveGame.Classifier.HD:
            return operations.hardDrop
        case Input.ActiveGame.Classifier.Hold:
            return operations.hold
        default:
            return Operation.None
    }
}

let rootOperation = (input: Input.ActiveGame) => Operation.Resolve(({ state }, dependencies) => {
    if (state.activeInputs.includes(input) || state.status != GameStatus.Active) {
        return Operation.None
    }
    let draftInputStartRecord = Operation.Draft(({ state, events }) => {
        state.activeInputs.push(input)
        events.push(GameEvent.InputStart(input))
    })
    return Operation.Sequence(
        dependencies.operations.completePendingMovement,
        draftInputStartRecord,
        performInputAction(input, dependencies)
    );
})

export default (input: Input.ActiveGame) => Operation.Export({
    operationName: "startInput",
    rootOperation: rootOperation(input)
})
