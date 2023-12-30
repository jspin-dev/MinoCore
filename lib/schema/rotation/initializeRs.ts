import type PieceIdentifier from "../../definitions/PieceIdentifier"
import Operation from "../../definitions/Operation"
import CoreOperationResult from "../../core/definitions/CoreOperationResult"
import CoreState from "../../core/definitions/CoreState"
import GeneratedGrids from "./definitions/GeneratedGrids"
import CoreDependencies from "../../core/definitions/CoreDependencies"
import type BinaryGrid from "../../definitions/BinaryGrid"
import RotationSystem from "./definitions/RotationSystem"
import Orientation from "../../definitions/Orientation"
import type Grid from "../../definitions/Grid"
import PieceSpec from "../definitions/PieceSpec"
import { createEmptyGrid, gridToList } from "../../util/sharedUtils"

export default (pieces: { [id: PieceIdentifier]: PieceSpec }) => {
    return Operation.Resolve<CoreOperationResult<CoreState & GeneratedGrids>, CoreDependencies>(() => {
        let grids = generateRotationGrids(pieces)
        return Operation.Draft(({ state }) => { state.generatedGrids = grids })
    })
}

let generateRotationGrids = (pieces: { [id: PieceIdentifier]: PieceSpec }) => {
    let translate = (grid: BinaryGrid, offset: RotationSystem.Offset): BinaryGrid => {
        let list = gridToList(grid, offset[0], offset[1], 1)
        let newGrid = createEmptyGrid(grid.length, grid[0].length, 0) as BinaryGrid
        list.forEach(coordinate => newGrid[coordinate.y][coordinate.x] = 1)
        return newGrid
    }
    return Object.entries(pieces).reduce((accum, [pieceId, definition]) => {
        let northGrid = [...definition.shape.map(s => [...s])]
        let eastGrid = rotateGrid(northGrid)
        let southGrid = rotateGrid(eastGrid)
        let westGrid = rotateGrid(southGrid)
        let offset = pieces[pieceId].offsets
        let gridSet = {
            [Orientation.North]: translate(northGrid, offset[Orientation.North]),
            [Orientation.East]: translate(eastGrid, offset[Orientation.East]),
            [Orientation.South]: translate(southGrid, offset[Orientation.South]),
            [Orientation.West]: translate(westGrid, offset[Orientation.West])
        }
        return { ...accum, [pieceId]: gridSet }
    }, {})
}

let rotateGrid = <T>(matrix: Grid<T>): Grid<T> => {
    return matrix[0].map((_, index) => {
        return matrix.map(row => row[index]).reverse()
    })
}
