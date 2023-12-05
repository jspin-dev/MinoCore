import Operation from "../../definitions/CoreOperation";

export default (n: number) => {
    if (!Number.isInteger(n) || n <= 0) {
        throw "Number of items to remove from the list must be an integer greater than 0"
    }
    return Operation.Draft(({ state }) => { 
        let randomNumbers = state.preview.randomNumbers;
        randomNumbers.splice(randomNumbers.length - n, n);
    })
}   
