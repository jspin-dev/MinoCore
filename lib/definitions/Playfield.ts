import type Grid from "./Grid"
import Cell from "./Cell"

type Playfield = Grid<Cell>

// Diff utils
namespace Playfield {

    export type Diff = { cell: Cell, x: number, y: number }[]


    export const diff = (before: Playfield, after: Playfield) => {
        if (!after) {
            return null
        }
        let coordinateList = before.flatMap((row, y) => {
            const initial: { cell: Cell, x: number, y: number }[] = []
            return row.reduce((accum, cell, x) => {
                let same = Cell.equal(after[y][x], cell)
                return same ? accum : [...accum, { cell,  x, y }]
            }, initial)
        })
        const returnValue = coordinateList.length > 0 ? coordinateList : null
        return returnValue satisfies Diff
    }

}

export default Playfield