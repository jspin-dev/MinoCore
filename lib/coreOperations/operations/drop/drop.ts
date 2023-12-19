import Cell from "../../../definitions/Cell";
import Operation from "../../definitions/CoreOperation";
import MovementType from "../../definitions/MovementType";
import PendingMovement from "../../definitions/PendingMovement";
import ShiftDirection from "../../../definitions/ShiftDirection";
import { findMaxDropDistance, findMaxShiftDistance } from "../../utils/coreOpStateUtils";
import continueInstantShift from "../shift/continueInstantShift";

export default (dy: number) => Operation.Util.requireActiveGame(
    Operation.Resolve(({ state }, { operations, schema }) => {
        if (dy <= 0) {
            return Operation.None; // Dy must be a positive integer for it to be a drop
        }
        let { activePiece, playfieldGrid } = state;
        let maxDropDistance = findMaxDropDistance(activePiece.coordinates, playfieldGrid, schema.playfield);
        if (maxDropDistance < dy) {
            return Operation.None;
        }
        return Operation.Sequence(
            draftDrop(dy),
            updateMaxShift, // Depends on updated playfieldGrid/coordinates from draftShift(dx)
            operations.refreshGhost,
            operations.updateLockStatus(MovementType.Shift),
            continueInstantShift
        )
    })
)

let updateMaxShift = Operation.Resolve(({ state }, { schema }) => {
    let { activePiece, playfieldGrid } = state;
    let maxRightShiftDistance = findMaxShiftDistance(ShiftDirection.Right, activePiece.coordinates, playfieldGrid, schema.playfield);
    let maxLeftShiftDistance = findMaxShiftDistance(ShiftDirection.Left, activePiece.coordinates, playfieldGrid, schema.playfield);
    return Operation.Draft(({ state }) => { 
        state.activePiece.availableShiftDistance = {
            [ShiftDirection.Right]: maxRightShiftDistance,
            [ShiftDirection.Left]: maxLeftShiftDistance
        }
    });
})

let draftDrop = (dy: number) => Operation.Draft(({ state }) => {
    let { activePiece, playfieldGrid, pendingMovement } = state;
    activePiece.coordinates.forEach(c => playfieldGrid[c.y][c.x] = Cell.Empty);
    activePiece.location.y += dy;
    activePiece.coordinates = activePiece.coordinates.map(c => {
        return { x: c.x, y: c.y + dy }
    });
    activePiece.coordinates.forEach(c => { playfieldGrid[c.y][c.x] = Cell.Active(activePiece.id) });
    activePiece.availableDropDistance -= dy;
    let distance = PendingMovement.isSoftDrop(pendingMovement) ? pendingMovement.dy + dy : dy;
    state.pendingMovement = PendingMovement.SoftDrop(distance);
})