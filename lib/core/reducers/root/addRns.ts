import CorePrecondition from "../../definitions/CorePrecondition"
import { withPreconditions } from "../../../util/reducerUtils"
import { createStateReducer } from "../../utils/coreReducerUtils"

const validRnRange = (numbers: number[]) => {
    return {
        isValid: () => !numbers.some(i => i < 0 || i >= 1),
        rationale: () => "All random numbers must be between 0 (inclusively) and 1 (exclusively)"
    } satisfies CorePrecondition
}

const rootReducer = (numbers: number[]) => createStateReducer(state => {
    return { randomNumbers: [...state.randomNumbers, ...numbers] }
})

// noinspection JSUnusedGlobalSymbols
export default (numbers: number[]) => withPreconditions({
    reducerName: "addRns",
    reduce: rootReducer(numbers),
    preconditions:  [ validRnRange(numbers) ]
})