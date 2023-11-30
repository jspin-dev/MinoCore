import Operation from "../../definitions/Operation";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import { findHardDropDistance } from "../../util/stateUtils";

export default (scoreType: DropScoreType) => Operation.ProvideStrict(({ state }, { operations }) => {
    let n = findHardDropDistance(state.playfield, state.settings);
    return operations.drop(n, scoreType);
})