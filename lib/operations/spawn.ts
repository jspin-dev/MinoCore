import type { Provider, Drafter } from "../definitions/operationalDefinitions";
import type { Coordinate } from "../definitions/playfieldDefinitions";
import type { State } from "../definitions/stateDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { TimerName, TimerOperation, GameStatus, GameOverCondition } from "../definitions/metaDefinitions";
import { LockdownStatus } from "../definitions/lockdownDefinitions";

import { updateStatus, insertTimerOperation } from "./meta";
import { cancelAutoShift } from "./meta";
import { instantShift } from "./shift";
import { Drop, instantDrop } from "./drop";
import { refreshGhost } from "./ghost";
import { setActivePiece } from "./activePiece";
import { gridToList } from "../util/sharedUtils";
import { instantAutoShiftActive, getInitialOrientationGrids } from "../util/stateUtils";

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
            : insertTimerOperation(TimerName.AutoDrop, TimerOperation.Start);
    }
}

let unchargeDAS: Drafter = {
    draft: draft => {
        Object.assign(draft.meta, {
            dasRightCharged: false,
            dasLeftCharged: false
        });
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
               unchargeDAS
            ];
        }
    }
}

let resetLockdown: Drafter = {
    draft: draft => { 
        draft.playfield.lockdownInfo = {
            status: LockdownStatus.NoLockdown ,
            largestY: 0
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
                return updateStatus(status);
            }

            return [
                resetLockdown,
                setActivePiece(coordinates, pieceId, location),
                refreshGhost,
                Drop.provider(1),
                instantShiftProvider,
                dropProvider
            ]
        }
    }
}