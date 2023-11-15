import { LockdownStatus } from "../definitions/lockdownDefinitions";
import { createEmptyGrid } from "../util/sharedUtils";
import { Coordinate } from "../definitions/playfieldDefinitions";
import { Operation } from "../definitions/operationalDefinitions";
import { Grid } from "../definitions/shared/Grid";

export namespace Init {

    export let draftInit = (grid: Grid) => Operation.Draft(draft => {
        draft.playfield = {
            grid,
            spinSnapshot: null,
            activePiece: {
                id: null,
                location: null,
                coordinates: [],
                ghostCoordinates: [],
                orientation: null,
                activeRotation: false
            },
            lockdownInfo: {
                status: LockdownStatus.NoLockdown,
                largestY: 0
            }
        }
    })
    
    export let provider = Operation.Provide(({ settings }) => draftInit(
        createEmptyGrid(settings.rows, settings.columns, 0)
    ))
    
}

export let setGridValue = (coordinate: Coordinate, value: number) => Operation.Draft( draft => {
    draft.playfield.grid[coordinate.y][coordinate.x] = value;
})