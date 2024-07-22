import Input from "../../../definitions/Input"
import type CoreDependencies from "../../definitions/CoreDependencies"
import GameStatus from "../../definitions/GameStatus"
import GameEvent from "../../../definitions/GameEvent"
import CoreResult from "../../definitions/CoreResult"
import { mapOperation, passthroughOperation, sequence } from "../../../util/operationUtils"
import { addEvent, mapCoreState, mapFromOperations } from "../../utils/coreOperationUtils"

const routeStartInputAction = (input: Input.ActiveGame) => mapFromOperations(operations => {
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
            return passthroughOperation
    }
})

// noinspection JSUnusedGlobalSymbols
export default (input: Input.ActiveGame) => mapOperation(
    ({ state }: CoreResult, { operations }: CoreDependencies) => {
        if (state.activeInputs.includes(input) || state.status != GameStatus.Active) {
            return passthroughOperation
        }
        const addActiveInput = mapCoreState(state => {
            return { activeInputs: [ ...state.activeInputs, input ] }
        })
        return sequence(
            operations.completePendingMovement,
            addActiveInput,
            addEvent(GameEvent.InputStart(input)),
            routeStartInputAction(input)
        )
    }
)
