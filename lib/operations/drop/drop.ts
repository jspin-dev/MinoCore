import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import { instantAutoShiftActive } from "../../util/stateUtils";
import updateLockStatusFor from "../lockdown/updateLockStatus";
import move from "../move";
import instantShift from "../shift/instantShift";
import recordDrop from "../statistics/recordDrop";

/**
 * Note that ghost coordinates NEVER depend on y coordinate position. If the ghost and active piece 
 * both share coordinates, the active piece will be the one displayed on the playfield grid. This will give the 
 * effect of the ghost being partially "behind" the active piece
 */

let continueInstantShiftIfActive = Operation.Provide(({ meta, settings }) => {
    return Operation.applyIf(instantAutoShiftActive(meta, settings), instantShift);
})

export default (dy: number, dropScoreType: DropScoreType) => Operation.SequenceStrict(
    move(0, dy),
    updateLockStatusFor(MovementType.Drop),
    recordDrop(dropScoreType, dy),
    continueInstantShiftIfActive
)
