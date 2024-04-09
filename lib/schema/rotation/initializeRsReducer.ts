import type PieceIdentifier from "../../definitions/PieceIdentifier"
import PieceSpec from "../definitions/PieceSpec"
import CoreState from "../../core/definitions/CoreState"
import GeneratedGrids from "./definitions/GeneratedGrids"
import type BinaryGrid from "../../definitions/BinaryGrid"
import RotationSystem from "./definitions/RotationSystem"
import Orientation from "../../definitions/Orientation"
import type Grid from "../../definitions/Grid"
import CoreReducer from "../../core/definitions/CoreReducer"

import { createEmptyGrid, gridToList } from "../../util/sharedUtils"
import { updateState } from "../../core/utils/coreReducerUtils"

export default (pieces: { [id: PieceIdentifier]: PieceSpec }): CoreReducer => {
    const grids = generateRotationGrids(pieces)
    return updateState<CoreState & GeneratedGrids>({ generatedGrids: grids }) as CoreReducer
}

const generateRotationGrids = (pieces: { [id: PieceIdentifier]: PieceSpec }) => {
    const translate = (grid: BinaryGrid, offset: RotationSystem.Offset) => {
        const list = gridToList(grid, offset[0], offset[1], 1)
        const newGrid = createEmptyGrid(grid.length, grid[0].length, 0)
        list.forEach(coordinate => newGrid[coordinate.y][coordinate.x] = 1)
        return newGrid
    }
    return Object.entries(pieces).reduce((accum, [pieceId, definition]) => {
        const northGrid = [...definition.shape.map(s => [...s])]
        const eastGrid = rotateGrid(northGrid)
        const southGrid = rotateGrid(eastGrid)
        const westGrid = rotateGrid(southGrid)
        const offset = pieces[pieceId].offsets
        const gridSet = {
            [Orientation.North]: translate(northGrid, offset[Orientation.North]),
            [Orientation.East]: translate(eastGrid, offset[Orientation.East]),
            [Orientation.South]: translate(southGrid, offset[Orientation.South]),
            [Orientation.West]: translate(westGrid, offset[Orientation.West])
        }
        return { ...accum, [pieceId]: gridSet }
    }, {}) satisfies { [id: PieceIdentifier]: GeneratedGrids.BinaryGridSet }
}

let rotateGrid = <T>(matrix: Grid<T>) => {
    return matrix[0].map((_, index) => {
        return matrix.map(row => row[index]).reverse()
    }) satisfies Grid<T>
}
