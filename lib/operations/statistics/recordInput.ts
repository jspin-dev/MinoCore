import Operation from "../../definitions/Operation";
import { calculateKPP } from "../../util/stateUtils";

export default Operation.Draft(({ state }) => {
    state.statistics.keysPressed++;
    state.statistics.kpp = calculateKPP(state.statistics);
})

