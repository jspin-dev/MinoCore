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

        export let Grid = (grid: Playfield): Types.Grid => {
            return { classifier: Classifier.Grid, grid }
        }

        export let Coordinates = (coordinates: { cell: Cell, x: number, y: number }[]): Types.Coordinates => {
            return { classifier: Classifier.Coordinates, coordinates }
        }

    }

    export let diff = (before: Playfield, after: Playfield): Diff => {
        if (!after) {
            return null
        }
        if (!before) {
            return Diff.Grid(after)
        }
        let coordinateList = before.flatMap((row, y) => {
            let initial: { cell: Cell, x: number, y: number }[] = []
            return row.reduce((accum, cell, x) => {
                let same = Cell.equal(after[y][x], cell)
                return same ? accum : [...accum, { cell,  x, y }]
            }, initial)
        })
        return coordinateList.length > 0 ? Diff.Coordinates(coordinateList) : null
    }

}

export default Playfield