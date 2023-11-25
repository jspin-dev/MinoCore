import Operation from "../definitions/Operation";
import { State } from "../definitions/stateTypes";

export default (linesToClear: number[]) => Operation.Provide(({ playfield }: State) => {
    if (linesToClear.length == 0) {
        return Operation.None;
    } 
    let lowestRowToClear = Math.max(...linesToClear);

    let linesToShift = playfield.grid.reduce((accum, row, i) => {
        let isLineToClear = !linesToClear.includes(i) && i < lowestRowToClear && row.some(block => block > 0)
        return isLineToClear ? [...accum, row] : accum;
    }, [] as number[][]);

    let shiftStart = lowestRowToClear - linesToShift.length + 1;

    return Operation.Draft(draft => {
        for (let i = shiftStart; i <= lowestRowToClear; i++) {
            draft.playfield.grid[i] = [...linesToShift[i-shiftStart]];
        }
        for (let i = shiftStart - linesToClear.length; i < shiftStart; i++) {
            draft.playfield.grid[i] = new Array(draft.settings.columns).fill(0);
        }
    })
})