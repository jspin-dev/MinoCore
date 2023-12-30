import Operation from "../../../definitions/CoreOperation"
import PendingMovement from "../../../definitions/PendingMovement"
import DropType from "../../../../definitions/DropType"

export default Operation.Resolve(({ state }, { operations }) => {
    let { settings, activePiece, pendingMovement } = state
    let softDropPending = PendingMovement.isDrop(pendingMovement) && pendingMovement.type == DropType.Soft
    let shouldInstantDrop = settings.softDropInterval === 0 && activePiece.availableDropDistance > 0 && softDropPending
    return shouldInstantDrop ? operations.drop(DropType.Soft, activePiece.availableDropDistance) : Operation.None
})
