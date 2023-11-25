import Operation from "../../definitions/Operation";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import { findHardDropDistance } from "../../util/stateUtils";
import drop from "./drop";

export default (dropScoreType: DropScoreType) => Operation.ProvideStrict(({ playfield, settings }) => {
    let n = findHardDropDistance(playfield, settings);
    return drop(n, dropScoreType);
})