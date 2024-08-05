import CorePrecondition from "../../definitions/CorePrecondition"
import { withPreconditions } from "../../../util/operationUtils"
import { mapCoreState } from "../../utils/coreOperationUtils"

const validRnRange = (numbers: number[]) => {
    return {
        isValid: () => !numbers.some(i => i < 0 || i >= 1),
        rationale: () => "All random numbers must be between 0 (inclusively) and 1 (exclusively)"
    } satisfies CorePrecondition
}

const rootOperation = (numbers: number[]) => mapCoreState(state => {
    return { randomNumbers: [...state.randomNumbers, ...numbers] }
})

// noinspection JSUnusedGlobalSymbols
export default (numbers: number[]) => withPreconditions({
    operationName: "addRns",
    operation: rootOperation(numbers),
    preconditions:  [ validRnRange(numbers) ]
})