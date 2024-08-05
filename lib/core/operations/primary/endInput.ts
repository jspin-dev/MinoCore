import Input from "../../../definitions/Input"
import CoreResult from "../../definitions/CoreResult"
import GameEvent from "../../../definitions/GameEvent"
import CorePreconditions from "../../utils/CorePreconditions"
import { passthroughOperation, sequence, withPrecondition } from "../../../util/operationUtils"
import { mapFromOperations } from "../../utils/coreOperationUtils"

const routeEndInputAction = (input: Input.ActiveGame) => mapFromOperations(operations => {
    switch (input.classifier) {
        case Input.ActiveGame.Classifier.Shift:
            return operations.endShiftInput(input.direction)
        case Input.ActiveGame.Classifier.SD:
            return operations.cancelSoftDrop
        default:
            return passthroughOperation
    }
})

const recordEndInput = (input: Input.ActiveGame) => (previousResult: CoreResult) => {
    const { state, events } = previousResult
    const activeInputs = state.activeInputs.filter(i => !Input.ActiveGame.equal(i, input))
    return {
        state: { ...state, activeInputs },
        events: [ ...events, GameEvent.InputEnd(input) ]
    }
}

const rootOperation = (input: Input.ActiveGame) => mapFromOperations(operations => sequence(
    operations.completePendingMovement,
    routeEndInputAction(input),
    recordEndInput(input)
))

// noinspection JSUnusedGlobalSymbols
export default (input: Input.ActiveGame) => withPrecondition({
    operationName: "initialize",
    operation: rootOperation(input),
    precondition: CorePreconditions.activeGame
})