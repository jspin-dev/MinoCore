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
import { DropScoreType } from "../definitions/scoring/scoringDefinitions";
import { countStep } from "./finesse";
import { MovementType } from "../definitions/inputDefinitions";
import { Operation } from "../definitions/operationalDefinitions";

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

let dropProvider = Operation.Provide(({ meta, settings }) => {
    if (!meta.softDropActive) {
        return Operation.None;
    }
    let timerOperation = insertTimerOperation(TimerName.AutoDrop, TimerOperation.Start)
    return Operation.Sequence(
        instantSoftDropActive(meta, settings) ? instantDrop(DropScoreType.Soft) : timerOperation,
        /**
         * Since we are on a new active piece, this counts as an additional move for finesse logging, even 
         * though user is still in the middle of the soft drop carried over from the previous piece
         */
        countStep(MovementType.Drop) 
    )
})

let unchargeDAS = Operation.Draft(draft => {
    Object.assign(draft.meta, {
        dasRightCharged: false,
        dasLeftCharged: false
    });
})

let shiftProvider = Operation.Provide(({ meta, settings }) => {
    if (!meta.dasRightCharged && !meta.dasLeftCharged) {
        return Operation.None;
    }
    if (settings.dasPreservationEnabled) {
        return Operation.Sequence(
            Operation.applyIf(instantAutoShiftActive(meta, settings), instantShift),
            /**
             * Since we are on a new active piece, this counts as an additional move for finesse logging, even 
             * though user still has one or both of left/right shift inputs active from the previous piece
             */
            countStep(MovementType.Shift) 
        )
    } else {
        return Operation.Sequence(cancelAutoShift, unchargeDAS);
    }
})

let resetLockdown = Operation.Draft(draft => { 
    draft.playfield.lockdownInfo = { status: LockdownStatus.NoLockdown, largestY: 0 }
})

/**
 * Spawns a piece (indicated by pieceId) at the top of the playfield,
 * If no collision, updates the active piece with new coordinates
 */ 
export let spawn = (pieceId: number) => Operation.Provide(({ settings, playfield }) => {
    let { coordinates, location } = getPieceInitializationInfo(pieceId, settings);

    // Detect game over
    if (coordinates.some(c => playfield.grid[c.y][c.x] > 0)) {
        let status = GameStatus.GameOver(GameOverCondition.Blockout);
        return updateStatus(status);
    }

    return Operation.Sequence(
        resetLockdown,
        setActivePiece(coordinates, pieceId, location),
        refreshGhost,
        Drop.provider(1, DropScoreType.Auto),
        shiftProvider,
        dropProvider
    )
})