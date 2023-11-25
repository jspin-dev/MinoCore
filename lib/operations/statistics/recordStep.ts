import Operation from "../../definitions/Operation"
import { MovementType } from "../../definitions/inputDefinitions"

export default (type: MovementType, n: number = 1) => Operation.Draft(draft => { 
    draft.statistics.steps[type] += n 
})