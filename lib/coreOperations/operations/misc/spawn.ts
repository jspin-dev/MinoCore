import { gridToList } from "../../../util/sharedUtils";
import Operation from "../../definitions/CoreOperation";
import GameEvent from "../../definitions/GameEvent";
import continueInstantShift from "../shift/continueInstantShift";
import GameOverCondition from "../../definitions/GameOverCondition";
import GameStatus from "../../definitions/GameStatus";
import LockdownStatus from "../../definitions/LockdownStatus";
import SideEffect from "../../definitions/SideEffect";
import Cell from "../../../definitions/Cell";
import PieceIdentifier from "../../../definitions/PieceIdentifier";
import { findMaxDropDistance, findMaxShiftDistance } from "../../utils/coreOpStateUtils"
import ShiftDirection from "../../../definitions/ShiftDirection"
import ActivePiece from "../../../definitions/ActivePiece"

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
        let newActivePiece: ActivePiece = {
            id: pieceId,
            location: startLocation,
            coordinates: coordinates,
            orientation: spawnOrientation,
            ghostCoordinates: [],
            availableDropDistance: findMaxDropDistance(coordinates, state.playfieldGrid, schema.playfield),
            availableShiftDistance: {
                [ShiftDirection.Left]: findMaxShiftDistance(ShiftDirection.Left, coordinates, state.playfieldGrid, schema.playfield),
                [ShiftDirection.Right]: findMaxShiftDistance(ShiftDirection.Right, coordinates, state.playfieldGrid, schema.playfield)
            }
        }

        let draftNewActivePiece = Operation.Draft(({ state, events }) => {
            state.lockdownInfo = { status: LockdownStatus.NoLockdown, largestY: 0 }
            state.activePiece = newActivePiece
            state.activePiece.coordinates.forEach(c => state.playfieldGrid[c.y][c.x] = Cell.Active(newActivePiece.id))
            events.push(GameEvent.Spawn(state.activePiece))
        })

        return Operation.Sequence(
            draftNewActivePiece,
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
    let shouldInstantDrop = settings.softDropInterval === 0 && activePiece.availableDropDistance > 0 && softDropActive
    return shouldInstantDrop ? operations.drop(activePiece.availableDropDistance) : draftTimerChange
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
