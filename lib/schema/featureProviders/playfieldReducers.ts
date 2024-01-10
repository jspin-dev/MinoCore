import PatternDetector from "../definitions/PlayfieldReducer"
import Cell from "../../definitions/Cell"
import Playfield from "../../definitions/Playfield";
import { createEmptyGrid } from "../../util/sharedUtils"

namespace PlayfieldReducers {

    export let standardCollapse: PatternDetector = {

        reduce({ playfield, schema }) {
            let shouldClear = (row: Cell[]) => row.every(cell => cell.classifier == Cell.Classifier.Locked)
            let rows = playfield.reduce((accum, row, y) => shouldClear(row) ? [...accum, y] : accum, [] as number[])
            let newPlayfield = clearAndCollapse(playfield, rows, schema.playfield.columns)
            return {
                playfield: newPlayfield,
                linesCleared: rows
            }
        }

    }

    let clearAndCollapse = (playfield: Playfield, rows: number[], playfieldWidth: number): Playfield => {
        let reducedPlayfield = playfield.filter((_, y) => !rows.includes(y))
        let lostHeight = playfield.length - reducedPlayfield.length
        return createEmptyGrid(lostHeight, playfieldWidth, Cell.Empty as Cell).concat(reducedPlayfield)
    }

}

export default PlayfieldReducers