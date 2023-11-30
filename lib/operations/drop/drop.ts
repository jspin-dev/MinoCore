import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import { instantAutoShiftActive } from "../../util/stateUtils";
import recordDrop from "../statistics/recordDrop";

/**
 * Note that ghost coordinates NEVER depend on y coordinate position. If the ghost and active piece 
 * both share coordinates, the active piece will be the one displayed on the playfield grid. This will give the 
 * effect of the ghost being partially "behind" the active piece
 */

let continueInstantShiftIfActive = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(instantAutoShiftActive(state.meta, state.settings), operations.instantShift);
})

let exportedOperation = (dy: number, dropScoreType: DropScoreType) => {
    return Operation.ProvideStrict((_, { operations }) => {
        return Operation.Sequence(
            operations.move(0, dy),
            operations.updateLockStatus(MovementType.Drop),
            recordDrop(dropScoreType, dy),
            continueInstantShiftIfActive
        )
    })
}

export default exportedOperation;