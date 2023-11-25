import Operation from "../../definitions/Operation"
import { MovementType } from "../../definitions/inputDefinitions"
import { instantSoftDropActive } from "../../util/stateUtils"
import startSoftDrop from "../drop/startSoftDrop"
import refreshGhost from "../ghost/refreshGhost"
import updateLockStatusFor from "../lockdown/updateLockStatus"
import move from "../move"

let shiftBy = (dx: number): Operation.Any => {
    if (dx < 0) {
        throw "Dx must be a positive integer. This function already uses meta.direction to decide left/right"
    }
    return Operation.Provide(state => move(dx * state.meta.direction, 0))
}

let continueInstantSoftDropIfActive = Operation.Provide(({ meta, settings }) => {
    return Operation.applyIf(instantSoftDropActive(meta, settings), startSoftDrop)
})

export default (dx: number) => Operation.SequenceStrict(
    shiftBy(dx),
    refreshGhost,
    updateLockStatusFor(MovementType.Shift),
    continueInstantSoftDropIfActive
)