import Operation from "../../definitions/Operation";
import { Offset, Orientation, RotationGridSet } from "../../definitions/rotationDefinitions";
import { Grid } from "../../definitions/shared/Grid";
import { createEmptyGrid, gridToList, rotateGrid } from "../../util/sharedUtils";

export default Operation.Provide(({ settings }) => {
    let { rotationGrids, shapes, rotationStateInfo } = settings.rotationSystem;

    if (rotationGrids != null) {
        return Operation.None;
    }

    let updatedGrids: RotationGridSet[] = shapes.map((shape, i) => {
        let stateInfo = rotationStateInfo.find(info => info.pieces.includes(i + 1));

        let northGrid: Grid = [...shape.map(s => [...s])];
        let eastGrid = rotateGrid(northGrid);
        let southGrid = rotateGrid(eastGrid);
        let westGrid = rotateGrid(southGrid);

        let pureRotations = [northGrid, eastGrid, southGrid, westGrid];

        // Since there is no state info, we can only provide pure rotations
        if (!stateInfo) {
            return {
                [Orientation.North]: pureRotations[Orientation.North],
                [Orientation.East]: pureRotations[Orientation.East],
                [Orientation.South]: pureRotations[Orientation.South],
                [Orientation.West]: pureRotations[Orientation.West]
            }
        }

        let northRotationState = stateInfo.states[Orientation.North];
        let eastRotationState = stateInfo.states[Orientation.East];
        let southRotationState = stateInfo.states[Orientation.South];
        let westRotationState = stateInfo.states[Orientation.West];

        return {
            [Orientation.North]: translate(
                pureRotations[northRotationState.pureRotationIndex], 
                northRotationState.offset || [0, 0]
            ),
            [Orientation.East]: translate(
                pureRotations[eastRotationState.pureRotationIndex],  
                eastRotationState.offset || [0, 0]
            ),
            [Orientation.South]: translate(
                pureRotations[southRotationState.pureRotationIndex],  
                southRotationState.offset || [0, 0]
                ),
            [Orientation.West]: translate(
                pureRotations[westRotationState.pureRotationIndex],  
                westRotationState.offset || [0, 0]
            )
        }
    });
    
    return Operation.Draft(draft => {
        draft.settings.rotationSystem.rotationGrids = updatedGrids;
    })
})

let translate = (grid: Grid, offset: Readonly<Offset>): Grid => {
    let list = gridToList(grid, offset[0], offset[1], 1);
    let newGrid = createEmptyGrid(grid.length, grid[0].length, 0);
    list.forEach(coordinate => newGrid[coordinate.y][coordinate.x] = 1);
    return newGrid;
}
