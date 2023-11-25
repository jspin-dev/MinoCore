import Operation from "../../definitions/Operation"

export default (numbers: number[]): Operation.Any => {
    if (numbers.some(i => i < 0 || i >= 1)) {
        throw "All random numbers must be between 0 (inclusively) and 1 (exclusively)"
    }
    return Operation.Draft(draft => { draft.preview.randomNumbers.push(...numbers) })
}