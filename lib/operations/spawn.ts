import { gridToList } from "../util/sharedUtils";
import { findInstantDropDistance, shouldContinueInstantSoftDrop } from "../util/stateUtils";
import Operation from "../definitions/CoreOperation";
import GameEvent from "../definitions/GameEvent";
import continueInstantShift from "./shift/continueInstantShift";
import Coordinate from "../definitions/Coordinate";
import GameOverCondition from "../definitions/GameOverCondition";
import GameStatus from "../definitions/GameStatus";
import LockdownStatus from "../definitions/LockdownStatus";
import Orientation from "../definitions/Orientation";
import SideEffect from "../definitions/SideEffect";
import Cell from "../definitions/Cell";
import PieceIdentifier from "../definitions/PieceIdentifier";

/**
 * Spawns a piece (indicated by pieceId) at the top of the playfield,
 * If no collision, updates the active piece with new coordinates
 */ 

export default (pieceId: PieceIdentifier) => {
    return Operation.Resolve(({ state }, { operations, schema }) => {
        let { startLocation, spawnOrientation } = schema.pieces[pieceId];
        let initialGrid = state.generatedRotationGrids[pieceId][spawnOrientation]
        let coordinates = gridToList(initialGrid, startLocation.x, startLocation.y, 1)

        // Detect game over
        if (coordinates.some(c => Cell.isLocked(state.playfieldGrid[c.y][c.x]))) {
            return Operation.Draft(({ state }) => { state.status = GameStatus.GameOver(GameOverCondition.Blockout) })
        }
        let draftLockdownReset = Operation.Draft(({ state }) => { 
            state.lockdownInfo = { status: LockdownStatus.NoLockdown, largestY: 0 }
        })    
        return Operation.Sequence(
            draftLockdownReset,
            draftActivePiece(coordinates, pieceId, startLocation, spawnOrientation),
            operations.refreshGhost,
            //operations.drop(1),
            resolveShiftContinuation,
            resolveDropContinuation
        )
    })
}

let resolveDropContinuation = Operation.Resolve(({ state }, { operations, schema }) => {
    let { softDropActive, activePiece, playfieldGrid } = state;
    let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
    if (!softDropActive) {
        return Operation.None;
    }
    let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoDrop, SideEffect.TimerOperation.Start))
    })
    return shouldContinueInstantSoftDrop(state, schema.playfield) 
        ? operations.drop(findInstantDropDistance(collisionPrereqisites)) 
        : draftTimerChange;
})

let resolveShiftContinuation = Operation.Resolve(({ state }, { operations }) => {
    if (!state.dasRightCharged && !state.dasLeftCharged) {
        return Operation.None;
    }
    if (state.settings.dasPreservationEnabled) {
        return continueInstantShift;
    } else {
        let unchargeDAS = Operation.Draft(({ state }) => {
            state.dasRightCharged = false;
            state.dasLeftCharged = false;
        })        
        return Operation.Sequence(operations.cancelAutoShift, unchargeDAS);
    }
})

let draftActivePiece = (
    coordinates: Coordinate[], 
    pieceId: PieceIdentifier, 
    location: Coordinate, 
    orientation: Orientation
) => {
    return Operation.Draft(({ state, events }) => {
        coordinates.forEach(c => state.playfieldGrid[c.y][c.x] = Cell.Active(pieceId));
        state.activePiece = {
            id: pieceId,
            location: location,
            coordinates: coordinates,
            orientation,
            ghostCoordinates: []
        }
        events.push(GameEvent.Spawn(state.activePiece));
    })
}
