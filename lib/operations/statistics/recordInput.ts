import Operation from "../../definitions/Operation";
import { calculateKPP } from "../../util/stateUtils";

export default Operation.Draft(draft => {
    draft.statistics.keysPressed++;
    draft.statistics.kpp = calculateKPP(draft.statistics);
})
