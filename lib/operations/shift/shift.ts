import Operation from "../../definitions/CoreOperation"
import MovementType from "../../definitions/MovementType"
import continueInstantSoftDrop from "../drop/continueInstantSoftDrop"

export default (dx: number) => Operation.Util.requireActiveGame(
    Operation.Provide((_, { operations }) => {
        if (dx < 0) {
            return Operation.None; // Dx must be a positive integer. This function already uses meta.direction to decide left/right
        }
        return Operation.Sequence(
            shiftBy(dx),
            operations.refreshGhost,
            operations.updateLockStatus(MovementType.Shift),
            continueInstantSoftDrop
        )
    })
)

let shiftBy = (dx: number) => Operation.Provide(({ state }, { operations }) => {
    return operations.move(dx * state.direction, 0)
})

