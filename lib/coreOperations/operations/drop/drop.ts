import Operation from "../../definitions/CoreOperation";
import MovementType from "../../definitions/MovementType";
import continueInstantShift from "../shift/continueInstantShift";

export default (dy: number) => Operation.Util.requireActiveGame(
    Operation.Resolve((_, { operations }) => Operation.Sequence(
        operations.move(0, dy),
        operations.updateLockStatus(MovementType.Drop),
        continueInstantShift
    ))
)