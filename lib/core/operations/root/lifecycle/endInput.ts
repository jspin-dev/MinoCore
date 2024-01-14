import GameEvent from "../../../../definitions/GameEvent"
import Operation from "../../../definitions/CoreOperation"
import Input from "../../../../definitions/Input"
import GameStatus from "../../../definitions/GameStatus"

const resolveInputEndAction = (input: Input.ActiveGame) => Operation.Resolve((_, { operations }) => {
    switch(input.classifier) {
        case Input.ActiveGame.Classifier.Shift:
            return operations.endShiftInput(input.direction)
        case Input.ActiveGame.Classifier.SD:
            return operations.cancelSoftDrop
        default:
            return Operation.None
    }
})

const draftInputEndRecord = (input: Input.ActiveGame) => Operation.Draft(({ state, events }) => {
    state.activeInputs = state.activeInputs.filter(i => !Input.ActiveGame.equal(i, input))
    events.push(GameEvent.InputEnd(input));
})

const rootOperation = (input: Input.ActiveGame) => Operation.Resolve(({ state }, { operations }) => {
    if (state.status != GameStatus.Active) {
        return Operation.None
    }
    return Operation.Sequence(
        operations.completePendingMovement,
        draftInputEndRecord(input),
        resolveInputEndAction(input)
    )
})

/**
 * Called when a user input ends. Usually this would be the release of a keypress
 */
export default (input: Input.ActiveGame) => Operation.Export({
    operationName: "endInput",
    rootOperation: rootOperation(input)
})
