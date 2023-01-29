import { State, Playfield } from "../definitions/stateDefinitions";
import { Drafter, Provider } from "../definitions/operationalDefinitions";

let getLinesToClear = (playfield: Playfield): number[] => {
    let { activePiece, grid } = playfield;
    return activePiece.coordinates.reduce((accum, c) => {
        if (!accum.includes(c.y)) {
            let rowFull = grid[c.y].every(block => block > 0);
            if (rowFull) {
                return [...accum, c.y];
            }
        }
        return accum;
    }, [] as number[]);
}   

let draftLineClear = (
    linesToClear: number[], 
    linesToShift: Readonly<number[]>[], 
    shiftStart: number, 
    lowestRowToClear: number
): Drafter => {
    return {
        draft: draft => {
            for (let i = shiftStart; i <= lowestRowToClear; i++) {
                draft.playfield.grid[i] = [...linesToShift[i-shiftStart]];
            }
            for (let i = shiftStart - linesToClear.length; i < shiftStart; i++) {
                draft.playfield.grid[i] = new Array(draft.settings.columns).fill(0);
            }
        }
    }
}

export let clearLines: Provider = {
    provide: ({ playfield }: State) =>  {
        let linesToClear = getLinesToClear(playfield);
        if (linesToClear.length == 0) {
            return [];
        } 
        let lowestRowToClear = Math.max(...linesToClear);
    
        let linesToShift = playfield.grid.reduce((accum, row, i) => {
            let isLineToClear = !linesToClear.includes(i) && i < lowestRowToClear && row.some(block => block > 0)
            return isLineToClear ? [...accum, row] : accum;
        }, [] as number[][]);
    
        let shiftStart = lowestRowToClear - linesToShift.length + 1;

        return draftLineClear(linesToClear, linesToShift, shiftStart, lowestRowToClear);
    }
}
