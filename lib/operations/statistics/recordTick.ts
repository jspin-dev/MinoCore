import Operation from "../../definitions/Operation";
import { calculatePPS } from "../../util/stateUtils";

export default Operation.Draft(draft => {
    draft.statistics.time++;
    draft.statistics.pps = calculatePPS(draft.statistics);
})
