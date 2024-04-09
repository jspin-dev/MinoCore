import Input from "../../../../definitions/Input"
import CoreResult from "../../../definitions/CoreResult"
import GameEvent from "../../../../definitions/GameEvent"
import CorePreconditions from "../../../utils/CorePreconditions"
import { passthroughReducer, sequence, withPrecondition } from "../../../../util/reducerUtils"
import { provideReducers } from "../../../utils/coreReducerUtils"

const routeEndInputAction = (input: Input.ActiveGame) => provideReducers(reducers => {
    switch (input.classifier) {
        case Input.ActiveGame.Classifier.Shift:
            return reducers.endShiftInput(input.direction)
        case Input.ActiveGame.Classifier.SD:
            return reducers.cancelSoftDrop
        default:
            return passthroughReducer
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

const rootReducer = (input: Input.ActiveGame) => provideReducers(reducers => {
    return sequence(
        reducers.completePendingMovement,
        routeEndInputAction(input),
        recordEndInput(input)
    )
})

export default (input: Input.ActiveGame) => withPrecondition({
    reducerName: "initialize",
    reduce: rootReducer(input),
    precondition: CorePreconditions.activeGame
})