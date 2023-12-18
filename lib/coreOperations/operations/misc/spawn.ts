import { gridToList } from "../../../util/sharedUtils";
import Operation from "../../definitions/CoreOperation";
import GameEvent from "../../definitions/GameEvent";
import continueInstantShift from "../shift/continueInstantShift";
import Coordinate from "../../../definitions/Coordinate";
import GameOverCondition from "../../definitions/GameOverCondition";
import GameStatus from "../../definitions/GameStatus";
import LockdownStatus from "../../definitions/LockdownStatus";
import Orientation from "../../../definitions/Orientation";
import SideEffect from "../../definitions/SideEffect";
import Cell from "../../definitions/Cell";
import PieceIdentifier from "../../../definitions/PieceIdentifier";
import GameSchema from "../../../schemas/definitions/GameSchema";
import { findInstantDropDistance } from "../../utils/coreOpStateUtils";

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
        let distanceToFloor = findInstantDropDistance(coordinates, state.playfieldGrid, schema.playfield);
        return Operation.Sequence(
            draftNewActivePiece(coordinates, pieceId, startLocation, spawnOrientation, distanceToFloor),
            operations.refreshGhost,
            //operations.drop(1),
            resolveShiftContinuation,
            resolveDropContinuation
        )
    })
}

let resolveDropContinuation = Operation.Resolve(({ state }, { operations }) => {
    let { softDropActive, activePiece, playfieldGrid, settings } = state;
    if (!softDropActive) {
        return Operation.None;
    }
    let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.AutoDrop, SideEffect.TimerOperation.Start))
    })
    let shouldInstantDrop = settings.softDropInterval === 0 && activePiece.distanceToFloor > 0 && softDropActive;
    return shouldInstantDrop ? operations.drop(activePiece.distanceToFloor) : draftTimerChange;
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

let draftNewActivePiece = (
    coordinates: Coordinate[], 
    pieceId: PieceIdentifier, 
    location: Coordinate, 
    orientation: Orientation,
    distanceToFloor: number
) => {
    return Operation.Draft(({ state, events }) => {
        state.lockdownInfo = { status: LockdownStatus.NoLockdown, largestY: 0 }
        coordinates.forEach(c => state.playfieldGrid[c.y][c.x] = Cell.Active(pieceId));
        state.activePiece = {
            id: pieceId,
            location: location,
            coordinates: coordinates,
            orientation,
            ghostCoordinates: [],
            distanceToFloor
        }
        events.push(GameEvent.Spawn(state.activePiece));
    })
}
