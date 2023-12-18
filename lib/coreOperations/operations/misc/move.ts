import { willCollide } from "../../../util/stateUtils";
import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import Cell from "../../definitions/Cell";
import { findInstantDropDistance } from "../../utils/coreOpStateUtils";

/**
 * Moves the active piece by the specified x/y offset if the new coordinates are unoccupied and within the playfield
 */
export default (dx: number, dy: number) => Operation.Util.requireActiveGame(
    Operation.Resolve(({ state }, { schema }) => {
        if (dx == 0 && dy == 0) {
            return Operation.None;
        }
        let { activePiece, playfieldGrid } = state;
        let collision = willCollide(playfieldGrid, schema.playfield, activePiece.coordinates, dx, dy);
        return Operation.Sequence(draftMovement(dx, dy).applyIf(!collision), resolveDistanceToFloor)
    })
)

let resolveDistanceToFloor = Operation.Resolve(({ state }, { schema }) => {
    let distanceToFloor = findInstantDropDistance(state.activePiece.coordinates, state.playfieldGrid, schema.playfield);
    return Operation.Draft(({ state }) => { state.activePiece.distanceToFloor = distanceToFloor });
})

let draftMovement = (dx: number, dy: number) => Operation.Draft(({ state }) => {
    let { activePiece, playfieldGrid } = state;
    activePiece.coordinates.forEach(c => playfieldGrid[c.y][c.x] = Cell.Empty);
    activePiece.location.x += dx;
    activePiece.location.y += dy;
    activePiece.coordinates = activePiece.coordinates.map(c => {
        return { x: c.x + dx, y: c.y + dy }
    });
    activePiece.coordinates.forEach(c => { playfieldGrid[c.y][c.x] = Cell.Active(activePiece.id) });

    let pendingMovement = state.pendingMovement;
    if (dx > 0 && dy == 0) {
        let distance = dx;
        if (pendingMovement?.classifier == PendingMovement.Classifier.RightShift) {
            distance += pendingMovement.dx;
        }
        state.pendingMovement = PendingMovement.RightShift(distance);
    } else if (dx < 0 && dy == 0) {
        let distance = -dx;
        if (pendingMovement?.classifier == PendingMovement.Classifier.LeftShift) {
            distance += pendingMovement.dx;
        }
        state.pendingMovement = PendingMovement.LeftShift(distance);
    } else if (dy > 0 && dx == 0) {
        let distance = dy;
        if (pendingMovement?.classifier == PendingMovement.Classifier.SoftDrop) {
            distance += pendingMovement.dy;
        }
        state.pendingMovement = PendingMovement.SoftDrop(distance);
    }
})