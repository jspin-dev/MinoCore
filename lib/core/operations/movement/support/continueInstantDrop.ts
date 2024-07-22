import CoreResult from "../../../definitions/CoreResult"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreDependencies from "../../../definitions/CoreDependencies"
import Input from "../../../../definitions/Input"
import DropType from "../../../../definitions/DropType"
import { withCondition, withPreconditions, mapOperation } from "../../../../util/operationUtils"

const rootOperation = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
    const { activePiece, activeInputs, settings } = state
    const softDropActive = activeInputs.some(input => input.classifier == Input.ActiveGame.Classifier.SD)
    const shouldInstantDrop = settings.dropMechanics.softInterval === 0
        && activePiece.availableDropDistance > 0
        && softDropActive
    return withCondition(operations.drop(DropType.Soft, activePiece.availableDropDistance), shouldInstantDrop)
})

export default withPreconditions({
    operationName: "continueInstantDrop",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame]
})