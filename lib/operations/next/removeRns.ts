import Operation from "../../definitions/Operation";

export default (n: number): Operation.Any => {
    if (!Number.isInteger(n) || n <= 0) {
        throw "Number of items to remove from the list must be an integer greater than 0"
    }
    return Operation.Draft(draft => { 
        let randomNumbers = draft.preview.randomNumbers;
        randomNumbers.splice(randomNumbers.length - n, n);
    })
}   
