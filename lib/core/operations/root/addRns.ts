import Operation from "../../definitions/CoreOperation"
import { CorePrecondition } from "../../utils/CorePreconditions"

const validRnRange = (numbers: number[]) => {
    return {
        isValid: () => !numbers.some(i => i < 0 || i >= 1),
        rationale: "All random numbers must be between 0 (inclusively) and 1 (exclusively)"
    } satisfies CorePrecondition
}

export default (numbers: number[]) => Operation.Export({
    operationName: "addRns",
    preconditions: [ validRnRange(numbers) ],
    rootOperation: Operation.Draft(({ state }) => { state.randomNumbers.push(...numbers) })
})
