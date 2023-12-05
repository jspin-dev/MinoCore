import Operation from "../../definitions/CoreOperation"
import { MovementType } from "../../definitions/inputDefinitions"
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions"
import { findInstantDropDistance, shouldContinueInstantSoftDrop } from "../../util/stateUtils"

export default (dx: number) => Operation.Util.requireActiveGame(
    Operation.Provide((_, { operations }) => {
        if (dx < 0) {
            return Operation.None; // Dx must be a positive integer. This function already uses meta.direction to decide left/right
        }
        return Operation.Sequence(
            shiftBy(dx),
            operations.refreshGhost,
            operations.updateLockStatus(MovementType.Shift),
            continueInstantSoftDropIfActive
        )
    })
)

let shiftBy = (dx: number) => Operation.Provide(({ state }, { operations }) => {
    return operations.move(dx * state.meta.direction, 0)
})

let continueInstantSoftDropIfActive = Operation.Provide(({ state }, { operations }) => {
    return Operation.Util.applyIf(shouldContinueInstantSoftDrop(state), operations.drop(findInstantDropDistance(state), DropScoreType.Soft))
})
