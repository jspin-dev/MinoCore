import Operation from "../definitions/CoreOperation";

export default (linesToClear: number[]) => Operation.Provide(({ state }) => {
    let playfield = state.playfield;
    if (linesToClear.length == 0) {
        return Operation.None;
    } 
    let lowestRowToClear = Math.max(...linesToClear);

    let linesToShift = playfield.grid.reduce((accum, row, i) => {
        let isLineToClear = !linesToClear.includes(i) && i < lowestRowToClear && row.some(block => block > 0)
        return isLineToClear ? [...accum, row] : accum;
    }, [] as number[][]);

    let shiftStart = lowestRowToClear - linesToShift.length + 1;

    return Operation.Draft(({ state }) => {
        for (let i = shiftStart; i <= lowestRowToClear; i++) {
            state.playfield.grid[i] = [...linesToShift[i-shiftStart]];
        }
        for (let i = shiftStart - linesToClear.length; i < shiftStart; i++) {
            state.playfield.grid[i] = new Array(state.settings.columns).fill(0);
        }
    })
})
