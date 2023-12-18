import Operation from "../../definitions/CoreOperation"
import MovementType from "../../definitions/MovementType"
import continueInstantSoftDrop from "../drop/continueInstantSoftDrop"

export default (dx: number) => Operation.Util.requireActiveGame(
    Operation.Resolve((_, { operations }) => {
        if (dx < 0) {
            return Operation.None; // Dx must be a positive integer. This function already uses meta.direction to decide left/right
        }
        return Operation.Sequence(
            resolveMovement(dx),
            operations.refreshGhost,
            operations.updateLockStatus(MovementType.Shift),
            continueInstantSoftDrop
        )
    })
)

let resolveMovement = (dx: number) => Operation.Resolve(({ state }, { operations }) => {
    return operations.move(dx * state.direction, 0)
})

