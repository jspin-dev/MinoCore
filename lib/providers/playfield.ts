import type { Provider, Actionable, Operation, Drafter } from "../definitions/operationalDefinitions";
import type { Coordinate } from "../definitions/playfieldDefinitions";
import type { State } from "../definitions/stateDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { TimerName, TimerOperation, GameStatus, GameOverCondition } from "../definitions/metaDefinitions";
import { LockdownStatus } from "../definitions/lockdownDefinitions";

import PlayfieldDrafters from "../drafters/playfieldDrafters";
import MetaDrafters from "../drafters/metaDrafters";
import { cancelAutoShift } from "./meta";
import { instantShift } from "./shift";
import { Drop, instantDrop } from "./drop";

import { createEmptyGrid, gridToList } from "../util/sharedUtils";
import { findHardDropDistance, instantAutoShiftActive, getInitialOrientationGrids } from "../util/stateUtils";

export let refreshGhostPlacement: Provider = {
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
        return PlayfieldDrafters.Makers.setGhost(ghostCoordinates);
    }    
}

export let setActivePiece = (
    coordinates: Coordinate[], 
    pieceId: number, 
    location: Coordinate
): Operation[] =>  [
    PlayfieldDrafters.Makers.setActivePiece(coordinates, pieceId, location),
    refreshGhostPlacement
]

export let init: Provider = {
    provide: ({ settings }: State): Drafter => {
        let grid = createEmptyGrid(settings.rows, settings.columns, 0);
        return PlayfieldDrafters.Makers.init(grid);
    }
}

export namespace Spawn {

    let getPieceInitializationInfo = (id: number, settings: Settings): { 
        location: Coordinate, 
        coordinates: Coordinate[] 
    } => {
        let location = settings.rotationSystem[0]
            .startLocations
            .find(info => info.pieces.includes(id))
            .location || { x: 0, y: 0 };
        let shape = getInitialOrientationGrids(settings.rotationSystem[0])[id - 1];
        return {
            location,
            coordinates: gridToList(shape, location.x, location.y, 1)
        }
    }
    
    let dropProvider: Provider = {
        provide: (state: State) => {
            return state.meta.instantSoftDropActive 
                ? instantDrop 
                : MetaDrafters.Makers.insertTimerOperation(TimerName.AutoDrop, TimerOperation.Start);
        }
    }

    let instantShiftProvider: Provider = {
        provide: ({ meta, settings }: State) => {
            if (!meta.dasRightCharged && !meta.dasLeftCharged) {
                return [];
            }
            if (settings.dasPreservationEnabled) {
                /**
                 * Only need to check 0-ARR case, since if ARR is greater than 0 and DAS is charged, 
                 * the auto shift timer is still active 
                 */
               return instantAutoShiftActive(meta, settings) ? instantShift : [];
            } else {
                return [
                    cancelAutoShift,
                    MetaDrafters.unchargeDAS
                ];
            }
        }
    }

    /**
     * Spawns a piece (indicated by pieceId) at the top of the playfield,
     * If no collision, updates the active piece with new coordinates
     */ 
    export let spawn = (pieceId: number): Provider => {
        return {
            provide: (state: State) => {
                let { coordinates, location } = getPieceInitializationInfo(pieceId, state.settings);
        
                // Detect game over
                if (coordinates.some(c => state.playfield.grid[c.y][c.x] > 0)) {
                    let status = GameStatus.GameOver(GameOverCondition.Blockout);
                    return MetaDrafters.Makers.updateStatus(status);
                }

                return [
                    PlayfieldDrafters.Makers.setLockdownStatus(LockdownStatus.NoLockdown),
                    PlayfieldDrafters.Makers.setLargestY(0),
                    PlayfieldDrafters.Makers.setActivePiece(coordinates, pieceId, location),
                    refreshGhostPlacement,
                    Drop.provider(1),
                    instantShiftProvider,
                    dropProvider
                ]
            }
        }
    }

}
