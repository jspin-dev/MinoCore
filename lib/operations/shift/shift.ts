import Operation from "../../definitions/Operation"
import { MovementType } from "../../definitions/inputDefinitions"
import { instantSoftDropActive } from "../../util/stateUtils"

export default (dx: number) => Operation.ProvideStrict((_, { operations }) => {
    return Operation.Sequence(
        shiftBy(dx),
        operations.refreshGhost,
        operations.updateLockStatus(MovementType.Shift),
        continueInstantSoftDropIfActive
    )
})

let shiftBy = (dx: number) => {
    if (dx < 0) {
        throw "Dx must be a positive integer. This function already uses meta.direction to decide left/right"
    }
    return Operation.Provide(({ state }, { operations }) => operations.move(dx * state.meta.direction, 0))
}

let continueInstantSoftDropIfActive = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(instantSoftDropActive(state.meta, state.settings), operations.startSoftDrop)
})
