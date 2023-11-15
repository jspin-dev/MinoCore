import type { Coordinate } from "../definitions/playfieldDefinitions";

import { findHardDropDistance } from "../util/stateUtils";
import { State } from "../definitions/stateTypes";
import { Operation } from "../definitions/operationalDefinitions";

let setGhost = (coordinates: Coordinate[]) => Operation.DraftStrict(draft => {
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
})

export let clearGhost = Operation.Draft(draft => {
    let { activePiece, grid } = draft.playfield;
    activePiece.ghostCoordinates.forEach(c => {
        if (grid[c.y][c.x] < 0) {
            grid[c.y][c.x] = 0;
        }
    });
    activePiece.ghostCoordinates = [];
}, {     
    description: "Clearing ghost",
    strict: true
}) 

export let refreshGhost = Operation.Provide(({ settings, playfield }) => {
    if (!settings.ghostEnabled) {
        // No need to call PlayfieldDrafters.clearGhost, should be done when setting ghostEnabled
        return Operation.None; 
    }
    let dy = findHardDropDistance(playfield, settings);
    let activePieceCoordinates = playfield.activePiece.coordinates;
    let ghostCoordinates = activePieceCoordinates
        .map(c => { return { x: c.x, y: c.y + dy } })
        .filter(c => {
            return !activePieceCoordinates.some(coord => coord.x === c.x && coord.y === c.y);
        });
    return setGhost(ghostCoordinates);
}, {
    description: "Refreshing ghost piece placement so that it is in sync with the active piece",
    strict: true
})
