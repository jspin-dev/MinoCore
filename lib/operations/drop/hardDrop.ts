import Operation from "../../definitions/Operation";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";

export default Operation.Provide((_, { operations }) => Operation.Sequence(
    operations.instantDrop(DropScoreType.Hard), 
    operations.lock
))