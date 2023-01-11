import type { Drafter } from "../definitions/operationalDefinitions";
import type { Grid } from "../definitions/sharedDefinitions";
import type { Coordinate } from "../definitions/playfieldDefinitions";
import type { Offset, Orientation } from "../definitions/rotationDefinitions";
import { LockdownStatus } from "../definitions/lockdownDefinitions";

namespace PlayfieldDrafters {

    export type KickInfo = {
        newOrientation: Orientation,
        matchingOffset?: Offset,
        unadjustedCoordinates?: Coordinate[]
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

    export namespace Makers {

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
    
        export let movePiece = (dx: number, dy: number): Drafter => {
            return {
                requiresActiveGame: true,
                log: "Moving piece",
                draft: draft => {
                    let { activePiece, grid } = draft.playfield;

                    activePiece.coordinates.forEach(c => grid[c.y][c.x] = 0);
                    activePiece.location.x += dx;
                    activePiece.location.y += dy;
                    activePiece.coordinates = activePiece.coordinates.map(c => {
                        return { x: c.x + dx, y: c.y + dy }
                    });
                    activePiece.coordinates.forEach(c => grid[c.y][c.x] = activePiece.id);
                    activePiece.activeRotation = false;
                }
            }
        }

        export let setGhost = (coordinates: Coordinate[]): Drafter => {
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

        export let init = (grid: Grid): Drafter => {
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
    
        export let clearLines = (
            linesToClear: number[], 
            linesToShift: Readonly<number[]>[], 
            shiftStart: number, 
            lowestRowToClear: number
        ): Drafter => {
            return {
                draft: draft => {
                    for (let i = shiftStart; i <= lowestRowToClear; i++) {
                        draft.playfield.grid[i] = [...linesToShift[i-shiftStart]];
                    }
                    for (let i = shiftStart - linesToClear.length; i < shiftStart; i++) {
                        draft.playfield.grid[i] = new Array(draft.settings.columns).fill(0);
                    }
                }
            }
        }
    
        export let setGridCoordinates = (coordinates: Coordinate[], pieceId: number): Drafter => {
            return {
                draft: draft => {
                    coordinates.forEach(c =>  draft.playfield.grid[c.y][c.x] = pieceId);
                }
            }
        }

        export let rotate = ({ matchingOffset, unadjustedCoordinates, newOrientation }: KickInfo): Drafter => {
            return {
                requiresActiveGame: true,
                draft: draft => {
                    let playfield = draft.playfield;
                    let { coordinates, location, id } = playfield.activePiece;

                    if (newOrientation != undefined) {
                        playfield.activePiece.orientation = newOrientation;
                    }
                    if (matchingOffset && unadjustedCoordinates) {
                        coordinates.forEach(c => playfield.grid[c.y][c.x] = 0);
                        coordinates.forEach((c, i) => {
                            coordinates[i].x = unadjustedCoordinates[i].x + matchingOffset[0];
                            coordinates[i].y = unadjustedCoordinates[i].y + matchingOffset[1];
                            playfield.grid[c.y][c.x] = id;
                        });
                    
                        location.x += matchingOffset[0];
                        location.y += matchingOffset[1];
                    }
                }
            }
        }

        export let setLockdownStatus = (status: LockdownStatus.Any): Drafter => {
            return {
                draft: draft => { draft.playfield.lockdownInfo.status = status }
            }
        }

        export let setLargestY = (y: number): Drafter => {
            return {
                draft: draft => { draft.playfield.lockdownInfo.largestY = y }
            }
        }
    
    }

}

export default PlayfieldDrafters;