import { LockdownStatus } from "../definitions/lockdownDefinitions";
import { createEmptyGrid } from "../util/sharedUtils";
import { State } from "../types/stateTypes";
import { Grid } from "../types/sharedTypes";
import { Coordinate } from "../definitions/playfieldDefinitions";

export namespace Init {

    export let draftInit = (grid: Grid): Drafter => {
        return {
            draft: draft => {
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
            }
        }
    }
    
    export let provider: Provider = {
        provide: ({ settings }: State): Drafter => {
            let grid = createEmptyGrid(settings.rows, settings.columns, 0);
            return draftInit(grid);
        }
    }
    
}

export let setGridValue = (coordinate: Coordinate, value: number): Drafter => {
    return {
        draft: draft => {
            draft.playfield.grid[coordinate.y][coordinate.x] = value;
        }
    }
}