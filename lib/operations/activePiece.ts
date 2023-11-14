import type { Coordinate } from "../definitions/playfieldDefinitions";

/*
* Note that there are times when we want to reset the active piece but leave the playfield grid as is (such 
* as locking), and other times when we also want to clear the active piece's coordinates on the grid to make 
* the piece 'disappear' (such as holding). Specify this with clearGrid.
*/
export let clearActivePiece = (clearGrid: boolean): Drafter => {
    return {
        requiresActiveGame: true,
        draft: draft => {
            let playfield = draft.playfield;
            // TODO: Does this do anything? This used to come after the reset of activePiece, when ghostCoordinate is []
            playfield.activePiece.ghostCoordinates.forEach(c => {
                if (playfield.grid[c.y][c.x] < 0) {
                    playfield.grid[c.y][c.x] = 0;
                }
            });
            if (clearGrid) {
                playfield.activePiece.coordinates.forEach(c => {
                    playfield.grid[c.y][c.x] = 0;
                });
            }
            playfield.activePiece = {
                id: null,
                location: null,
                coordinates: [],
                ghostCoordinates: [],
                orientation: null,
                activeRotation: false
            };
        }
    }
}

export let setActivePiece = (
    coordinates: Coordinate[], 
    pieceId: number, 
    location: Coordinate
): Drafter => {
    return {
        draft: draft => {
            coordinates.forEach(c => draft.playfield.grid[c.y][c.x] = pieceId);
            Object.assign(draft.playfield.activePiece, {
                id: pieceId,
                location: location,
                coordinates: coordinates,
                orientation: 0
            });
        }
    }
}
