import Operation from "../../definitions/CoreOperation";

export default (n: number) => {
    if (!Number.isInteger(n) || n <= 0) {
        throw "Number of items to remove from the list must be an integer greater than 0"
    }
    return Operation.Draft(({ state }) => { 
        state.randomNumbers.splice(state.randomNumbers.length - n, n);
    })
}   
