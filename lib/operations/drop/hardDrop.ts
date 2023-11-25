import Operation from "../../definitions/Operation";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import lock from "../lockdown/lock";
import instantDrop from "./instantDrop";

export default Operation.Sequence(instantDrop(DropScoreType.Hard), lock)
