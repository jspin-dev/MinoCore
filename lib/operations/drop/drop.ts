import Operation from "../../definitions/CoreOperation";
import { MovementType } from "../../definitions/inputDefinitions";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import { findInstantShiftDistance, shouldContinueInstantShift } from "../../util/stateUtils";

export default (dy: number, dropScoreType: DropScoreType) => Operation.requireActiveGame(
    Operation.Provide((_, { operations }) => Operation.Sequence(
        operations.move(0, dy),
        operations.updateLockStatus(MovementType.Drop),
        continueInstantShiftIfActive
    ))
)

/**
 * Note that ghost coordinates NEVER depend on y coordinate position. If the ghost and active piece 
 * both share coordinates, the active piece will be the one displayed on the playfield grid. This will give the 
 * effect of the ghost being partially "behind" the active piece
 */

let continueInstantShiftIfActive = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(shouldContinueInstantShift(state), operations.shift(findInstantShiftDistance(state)));
}, {
    description: "continue instant shift"
})
