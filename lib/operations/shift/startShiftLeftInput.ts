import Operation from "../../definitions/Operation"
import { MovementType } from "../../definitions/inputDefinitions"
import { ShiftDirection } from "../../definitions/playfieldDefinitions"
import recordStep from "../statistics/recordStep"
import startDAS from "./startDAS"

// Why are we just setting DAS right charged to true?
let conditionalCharge = Operation.Provide(({ settings }) => {
    let chargeRight = Operation.Draft(draft => { draft.meta.dasRightCharged = true })
    return Operation.applyIf(!settings.dasInteruptionEnabled, chargeRight)
})

export default Operation.SequenceStrict(
    Operation.Draft(draft => { draft.meta.direction = ShiftDirection.Left }),
    conditionalCharge,
    startDAS,
    recordStep(MovementType.Shift)
)