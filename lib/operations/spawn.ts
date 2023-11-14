import type { Coordinate } from "../definitions/playfieldDefinitions";
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
import { instantAutoShiftActive, instantSoftDropActive, getInitialOrientationGrids } from "../util/stateUtils";
import { DropScoreType } from "../definitions/scoringDefinitions";
import { countStep } from "./finesse";
import { MovementType } from "../definitions/inputDefinitions";
import { provideIf } from "../util/providerUtils";
import { State } from "../types/stateTypes";

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
    provide: ({ meta, settings }) => {
        if (!meta.softDropActive) {
            return [];
        }
        let timerOperation = insertTimerOperation(TimerName.AutoDrop, TimerOperation.Start)
        return [
            instantSoftDropActive(meta, settings) ? instantDrop(DropScoreType.Soft) : timerOperation,
            /**
             * Since we are on a new active piece, this counts as an additional move for finesse logging, even 
             * though user is still in the middle of the soft drop carried over from the previous piece
             */
            countStep(MovementType.Drop) 
        ]
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

let shiftProvider: Provider = {
    provide: ({ meta, settings }: State) => {
        if (!meta.dasRightCharged && !meta.dasLeftCharged) {
            return [];
        }
        if (settings.dasPreservationEnabled) {
            return [
                ...provideIf(instantAutoShiftActive(meta, settings), instantShift),
                /**
                 * Since we are on a new active piece, this counts as an additional move for finesse logging, even 
                 * though user still has one or both of left/right shift inputs active from the previous piece
                 */
                countStep(MovementType.Shift) 
            ]
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
                Drop.provider(1, DropScoreType.Auto),
                shiftProvider,
                dropProvider
            ]
        }
    }
}