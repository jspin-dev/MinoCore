import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { ShiftDirection } from "../../definitions/playfieldDefinitions";
import recordStep from "../statistics/recordStep";
import startDAS from "./startDAS";

// Why are we just setting DAS left charged to true?
let conditionalCharge = Operation.Provide(({ settings }) => {
    let chargeLeft = Operation.Draft(draft => { draft.meta.dasRightCharged = true });
    return Operation.applyIf(!settings.dasInteruptionEnabled, chargeLeft);
})

export default Operation.SequenceStrict(
    Operation.Draft(draft => { draft.meta.direction = ShiftDirection.Right }),
    conditionalCharge,
    startDAS,
    recordStep(MovementType.Shift)
)