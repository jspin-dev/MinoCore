import Operation from "../../definitions/Operation"
import { MovementType } from "../../definitions/inputDefinitions"

export default (type: MovementType, n: number = 1) => Operation.Draft(({ state }) => { 
    state.statistics.steps[type] += n 
})