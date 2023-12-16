import BinaryGrid from "../../definitions/BinaryGrid";
import Operation from "../../definitions/CoreOperation";
import GameSchema from "../../definitions/GameSchema";
import Grid from "../../definitions/Grid";
import Orientation from "../../definitions/Orientation";
import { createEmptyGrid, gridToList } from "../../util/sharedUtils";

export default Operation.Provide(({ state }, { schema }) => {
    if (state.generatedRotationGrids != null) {
        return Operation.None;
    }
    let grids = generateRotationGrids(schema);
    return Operation.Draft(({ state }) => {
        state.generatedRotationGrids = grids;
    })
})

let generateRotationGrids = (schema: GameSchema) => {
    let translate = (grid: BinaryGrid, offset: Readonly<GameSchema.Offset>): BinaryGrid => {
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
        let gridSet = {
            [Orientation.North]: translate(northGrid, definition.offsets[Orientation.North]),
            [Orientation.East]: translate(eastGrid, definition.offsets[Orientation.East]),
            [Orientation.South]: translate(southGrid, definition.offsets[Orientation.South]),
            [Orientation.West]: translate(westGrid, definition.offsets[Orientation.West])
        }
        return { ...accum, [pieceId]: gridSet }
    }, {})
}

let rotateGrid = <T>(matrix: Grid<T>): Grid<T> => {
    return matrix[0].map((_, index) => {
        return matrix.map(row => row[index]).reverse();
    });
}
