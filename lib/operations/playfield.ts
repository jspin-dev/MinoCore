import type { Provider, Drafter } from "../definitions/operationalDefinitions";
import type { State } from "../definitions/stateDefinitions";
import { LockdownStatus } from "../definitions/lockdownDefinitions";
import type { Grid } from "../definitions/sharedDefinitions";

import { createEmptyGrid } from "../util/sharedUtils";

export namespace Init {

    export let draftInit = (grid: Grid): Drafter => {
        return {
            draft: draft => {
                draft.playfield = {
                    grid,
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

