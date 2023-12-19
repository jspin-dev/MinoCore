import Cell from "../../../definitions/Cell";
import Operation from "../../definitions/CoreOperation"
import MovementType from "../../definitions/MovementType"
import PendingMovement from "../../definitions/PendingMovement";
import ShiftDirection from "../../../definitions/ShiftDirection";
import { findMaxDropDistance, findMaxShiftDistance } from "../../utils/coreOpStateUtils";
import continueInstantSoftDrop from "../drop/continueInstantSoftDrop"

export default (dx: number) => Operation.Util.requireActiveGame(
    Operation.Resolve(({ state }, { operations, schema }) => {
        if (dx <= 0) {
            return Operation.None; // Dx must be a positive integer. This function already uses meta.direction to decide left/right
        }
        let { direction, activePiece, playfieldGrid } = state;
        let maxShiftDistance = findMaxShiftDistance(direction, activePiece.coordinates, playfieldGrid, schema.playfield);
        if (maxShiftDistance < dx) {
            return Operation.None;
        }
        return Operation.Sequence(
            draftShift(dx),
            updateMaxDrop, // Depends on updated playfieldGrid/coordinates from draftShift(dx)
            operations.refreshGhost,
            operations.updateLockStatus(MovementType.Shift),
            continueInstantSoftDrop
        )
    })
)

let updateMaxDrop = Operation.Resolve(({ state }, { schema }) => {
    let { activePiece, playfieldGrid } = state;
    let maxDropDistance = findMaxDropDistance(activePiece.coordinates, playfieldGrid, schema.playfield);
    return Operation.Draft(({ state }) => { state.activePiece.availableDropDistance = maxDropDistance });
})

let draftShift = (dx: number) => Operation.Draft(({ state }) => {
    let netDx = dx * state.direction;
    let { activePiece, playfieldGrid } = state;
    activePiece.coordinates.forEach(c => playfieldGrid[c.y][c.x] = Cell.Empty);
    activePiece.location.x += netDx;
    activePiece.coordinates = activePiece.coordinates.map(c => {
        return { x: c.x + netDx, y: c.y }
    });
    activePiece.coordinates.forEach(c => { playfieldGrid[c.y][c.x] = Cell.Active(activePiece.id) });
    activePiece.availableShiftDistance[ShiftDirection.Left] += netDx;
    activePiece.availableShiftDistance[ShiftDirection.Right] -= netDx;

    let pendingMovement = state.pendingMovement;
    if (netDx > 0) {
        let distance = PendingMovement.isRightShift(pendingMovement) ? pendingMovement.dx + netDx : netDx;
        state.pendingMovement = PendingMovement.RightShift(distance);
    } else {
        let distance = PendingMovement.isLeftShift(pendingMovement) ? pendingMovement.dx + netDx : netDx;
        state.pendingMovement = PendingMovement.LeftShift(distance);
    }
})