import type Grid from "./Grid"
import Cell from "./Cell"

type Playfield = Grid<Cell>

// Diff utils
namespace Playfield {

    export type Diff = Diff.Types.Grid | Diff.Types.Coordinates

    export namespace Diff {

        export enum Classifier {
            Grid,
            Coordinates
        }

        export namespace Types {

            export interface Grid {
                classifier: Classifier.Grid,
                grid: Playfield
            }

            export interface Coordinates {
                classifier: Classifier.Coordinates,
                coordinates: { cell: Cell, x: number, y: number }[]
            }

        }

    }

    // Convenience
    export namespace Diff {

        export const Grid = (grid: Playfield) => {
            return { classifier: Classifier.Grid, grid } satisfies Types.Grid
        }

        export const Coordinates = (coordinates: { cell: Cell, x: number, y: number }[]) => {
            return { classifier: Classifier.Coordinates, coordinates } satisfies Types.Coordinates
        }

    }

    export const diff = (before: Playfield, after: Playfield) => {
        if (!after) {
            return null
        }
        if (!before) {
            return Diff.Grid(after)
        }
        let coordinateList = before.flatMap((row, y) => {
            const initial: { cell: Cell, x: number, y: number }[] = []
            return row.reduce((accum, cell, x) => {
                let same = Cell.equal(after[y][x], cell)
                return same ? accum : [...accum, { cell,  x, y }]
            }, initial)
        })
        const returnValue = coordinateList.length > 0 ? Diff.Coordinates(coordinateList) : null
        return returnValue satisfies Diff
    }

}

export default Playfield