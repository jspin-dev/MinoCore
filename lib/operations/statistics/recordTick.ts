import Operation from "../../definitions/Operation";
import { calculatePPS } from "../../util/stateUtils";

export default Operation.Draft(({ state }) => {
    state.statistics.time++;
    state.statistics.pps = calculatePPS(state.statistics);
})
