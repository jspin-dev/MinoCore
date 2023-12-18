import Cell from "../../definitions/Cell";
import Operation from "../../definitions/CoreOperation";

export default (linesToClear: number[]) => Operation.Resolve(({ state }, { schema }) => {
    if (linesToClear.length == 0) {
        return Operation.None;
    } 
    let lowestRowToClear = Math.max(...linesToClear);

    let linesToShift = state.playfieldGrid.reduce((accum, row, i) => {
        let isLineToClear = !linesToClear.includes(i) && i < lowestRowToClear && row.some(cell => !Cell.isEmpty(cell))
        return isLineToClear ? [...accum, row] : accum;
    }, [] as Cell[][]);

    let shiftStart = lowestRowToClear - linesToShift.length + 1;

    return Operation.Draft(({ state }) => {
        for (let i = shiftStart; i <= lowestRowToClear; i++) {
            state.playfieldGrid[i] = [...linesToShift[i-shiftStart]];
        }
        for (let i = shiftStart - linesToClear.length; i < shiftStart; i++) {
            state.playfieldGrid[i] = new Array(schema.playfield.columns).fill(Cell.Empty);
        }
    })
})
