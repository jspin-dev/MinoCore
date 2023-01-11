import { State, Playfield } from "../definitions/stateDefinitions";
import { Actionable } from "../definitions/operationalDefinitions";
import PlayfieldDrafters from "../drafters/playfieldDrafters";

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

export let clearLines = {
    provide: ({ playfield }: State): Actionable =>  {
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

        return PlayfieldDrafters.Makers.clearLines(linesToClear, linesToShift, shiftStart, lowestRowToClear);
    }
}
