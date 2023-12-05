import Operation from "../../definitions/CoreOperation";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import { findInstantDropDistance } from "../../util/stateUtils";

export default Operation.Provide(({ state }, { operations }) => Operation.Sequence(
    operations.drop(findInstantDropDistance(state), DropScoreType.Hard),
    operations.lock
))