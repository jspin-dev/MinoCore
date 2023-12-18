import BinaryGrid from "../../../definitions/BinaryGrid";
import Operation from "../../definitions/CoreOperation";
import GameSchema from "../../../schemas/definitions/GameSchema";
import Grid from "../../../definitions/Grid";
import Orientation from "../../../definitions/Orientation";
import RotationSystem from "../../../schemas/definitions/RotationSystem";
import { createEmptyGrid, gridToList } from "../../../util/sharedUtils";

export default Operation.Resolve(({ state }, { schema }) => {
    if (state.generatedRotationGrids != null) {
        return Operation.None;
    }
    let grids = generateRotationGrids(schema);
    return Operation.Draft(({ state }) => {
        state.generatedRotationGrids = grids;
    })
})

let generateRotationGrids = (schema: GameSchema) => {
    let translate = (grid: BinaryGrid, offset: Readonly<RotationSystem.Offset>): BinaryGrid => {
        let list = gridToList(grid, offset[0], offset[1], 1);
        let newGrid = createEmptyGrid(grid.length, grid[0].length, 0) as BinaryGrid;
        list.forEach(coordinate => newGrid[coordinate.y][coordinate.x] = 1);
        return newGrid;
    }
    return Object.entries(schema.pieces).reduce((accum, [pieceId, definition]) => {
        let northGrid = [...definition.shape.map(s => [...s])];
        let eastGrid = rotateGrid(northGrid);
        let southGrid = rotateGrid(eastGrid);
        let westGrid = rotateGrid(southGrid);
        let offsets = schema.rotationSystem.offsets[pieceId];
        let gridSet = {
            [Orientation.North]: translate(northGrid, offsets[Orientation.North]),
            [Orientation.East]: translate(eastGrid, offsets[Orientation.East]),
            [Orientation.South]: translate(southGrid, offsets[Orientation.South]),
            [Orientation.West]: translate(westGrid, offsets[Orientation.West])
        }
        return { ...accum, [pieceId]: gridSet }
    }, {})
}

let rotateGrid = <T>(matrix: Grid<T>): Grid<T> => {
    return matrix[0].map((_, index) => {
        return matrix.map(row => row[index]).reverse();
    });
}
