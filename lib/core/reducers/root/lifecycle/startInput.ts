import Input from "../../../../definitions/Input"
import type CoreDependencies from "../../../definitions/CoreDependencies"
import GameStatus from "../../../definitions/GameStatus"
import GameEvent from "../../../../definitions/GameEvent"
import CoreResult from "../../../definitions/CoreResult"
import { mapReducer, passthroughReducer, sequence } from "../../../../util/reducerUtils"
import { addEvent, createStateReducer, provideReducers } from "../../../utils/coreReducerUtils"

const routeStartInputAction = (input: Input.ActiveGame) => provideReducers(reducers => {
    switch (input.classifier) {
        case Input.ActiveGame.Classifier.Shift:
            return reducers.startShiftInput(input.direction)
        case Input.ActiveGame.Classifier.Rotate:
            return reducers.rotate(input.rotation)
        case Input.ActiveGame.Classifier.SD:
            return reducers.startSoftDrop
        case Input.ActiveGame.Classifier.HD:
            return reducers.hardDrop
        case Input.ActiveGame.Classifier.Hold:
            return reducers.hold
        default:
            return passthroughReducer
    }
})

// noinspection JSUnusedGlobalSymbols
export default (input: Input.ActiveGame) => mapReducer(
    ({ state }: CoreResult, { reducers }: CoreDependencies) => {
        if (state.activeInputs.includes(input) || state.status != GameStatus.Active) {
            return passthroughReducer
        }
        const addActiveInput = createStateReducer(state => {
            return { activeInputs: [ ...state.activeInputs, input ] }
        })
        return sequence(
            reducers.completePendingMovement,
            addActiveInput,
            addEvent(GameEvent.InputStart(input)),
            routeStartInputAction(input)
        )
    }
)
