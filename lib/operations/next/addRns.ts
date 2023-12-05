import Operation from "../../definitions/CoreOperation";

export default (numbers: number[]) => {
    if (numbers.some(i => i < 0 || i >= 1)) {
        throw "All random numbers must be between 0 (inclusively) and 1 (exclusively)"
    }
    return Operation.Draft(({ state }) => { state.preview.randomNumbers.push(...numbers) })
}