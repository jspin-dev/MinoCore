import PatternDetector from "../definitions/PlayfieldReducer"
import Cell from "../../definitions/Cell"
import Playfield from "../../definitions/Playfield";
import { createEmptyGrid } from "../../util/sharedUtils"

namespace PlayfieldReducers {

    export const standardCollapse = {
        reduce({ playfield, schema }) {
            const shouldClear = (row: Cell[]) => row.every(cell => cell.classifier == Cell.Classifier.Locked)
            const rows = playfield.reduce((accum, row, y) => shouldClear(row) ? [...accum, y] : accum, [] as number[])
            const newPlayfield = clearAndCollapse(playfield, rows, schema.playfield.columns)
            return {
                playfield: newPlayfield,
                linesCleared: rows
            }
        }
    } satisfies PatternDetector

    const clearAndCollapse = (playfield: Playfield, rows: number[], playfieldWidth: number) => {
        const reducedPlayfield = playfield.filter((_, y) => !rows.includes(y))
        const lostHeight = playfield.length - reducedPlayfield.length
        return createEmptyGrid(lostHeight, playfieldWidth, Cell.Empty).concat(reducedPlayfield) satisfies Playfield
    }

}

export default PlayfieldReducers