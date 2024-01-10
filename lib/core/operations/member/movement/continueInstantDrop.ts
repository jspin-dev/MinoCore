import Operation from "../../../definitions/CoreOperation"
import DropType from "../../../../definitions/DropType"
import Input from "../../../../definitions/Input"

export default Operation.Resolve(({ state }, { operations }) => {
    let { settings, activePiece, activeInputs } = state
    let softDropActive = activeInputs.some(input => input.classifier == Input.ActiveGame.Classifier.SD)
    let shouldInstantDrop = settings.softDropInterval === 0 && activePiece.availableDropDistance > 0 && softDropActive
    return shouldInstantDrop ? operations.drop(DropType.Soft, activePiece.availableDropDistance) : Operation.None
})
