import type { Provider, Actionable, Drafter } from "../definitions/operationalDefinitions";
import type { Coordinate } from "../definitions/playfieldDefinitions";
import type { State } from "../definitions/stateDefinitions";

import { findHardDropDistance } from "../util/stateUtils";

let setGhost = (coordinates: Coordinate[]): Drafter => {
    return {
        requiresActiveGame: true,
        draft: draft => {
            let { activePiece, grid } = draft.playfield;
            activePiece.ghostCoordinates.forEach(c => {
                if (grid[c.y][c.x] < 0) {
                    grid[c.y][c.x] = 0;
                }
            });
            activePiece.ghostCoordinates = coordinates;
            /**
             * Ghost coordinates will only be represented on the grid if there is no
             * active piece coordinate already in that cell.
             */
            coordinates.forEach(c => {
                if (grid[c.y][c.x] <= 0) {
                    grid[c.y][c.x] = -activePiece.id
                }
            });
        }
    }
}

export let clearGhost: Drafter = {
    requiresActiveGame: true,
    draft: draft => {
        let { activePiece, grid } = draft.playfield;
        activePiece.ghostCoordinates.forEach(c => {
            if (grid[c.y][c.x] < 0) {
                grid[c.y][c.x] = 0;
            }
        });
        activePiece.ghostCoordinates = [];
    }
}

export let refreshGhost: Provider = {
    log: "Refreshing ghost piece placement so that it is in sync with the active piece",
    requiresActiveGame: true,
    provide: ({ settings, playfield }: State): Actionable => {
        if (!settings.ghostEnabled) {
            // No need to call PlayfieldDrafters.clearGhost, should be done when setting ghostEnabled
            return []; 
        }
        let dy = findHardDropDistance(playfield, settings);
        let activePieceCoordinates = playfield.activePiece.coordinates;
        let ghostCoordinates = activePieceCoordinates
            .map(c => { return { x: c.x, y: c.y + dy } })
            .filter(c => {
                return !activePieceCoordinates.some(coord => coord.x === c.x && coord.y === c.y);
            });
        return setGhost(ghostCoordinates);
    }    
}
