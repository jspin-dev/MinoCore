import CoreResult from "../../../definitions/CoreResult"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreDependencies from "../../../definitions/CoreDependencies"
import Input from "../../../../definitions/Input"
import DropType from "../../../../definitions/DropType"
import { withCondition, withPreconditions, mapReducer } from "../../../../util/reducerUtils"

const rootReducer = mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => {
    const { activePiece, activeInputs, settings } = state
    const softDropActive = activeInputs.some(input => input.classifier == Input.ActiveGame.Classifier.SD)
    const shouldInstantDrop = settings.dropMechanics.softInterval === 0
        && activePiece.availableDropDistance > 0
        && softDropActive
    return withCondition(reducers.drop(DropType.Soft, activePiece.availableDropDistance), shouldInstantDrop)
})

export default withPreconditions({
    reducerName: "continueInstantDrop",
    reduce: rootReducer,
    preconditions: [ CorePreconditions.activeGame ]
})