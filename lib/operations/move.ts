import { willCollide } from "../util/stateUtils";
import Operation from "../definitions/CoreOperation";
import PendingMovement from "../definitions/PendingMovement";

/**
 * Moves the active piece by the specified x/y offset if the new coordinates are unoccupied and within the playfield
 */
export default (dx: number, dy: number) => Operation.Util.requireActiveGame(
    Operation.Provide(({ state }) => {
        if (dx == 0 && dy == 0) {
            return Operation.None;
        }
        let collision = willCollide(state.playfield.activePiece.coordinates, dx, dy, state.playfield, state.settings);
        return Operation.Util.applyIf(!collision, move(dx, dy));
    })
)

let move = (dx: number, dy: number) => Operation.Draft(({ state }) => {
    let { activePiece, grid } = state.playfield;
    activePiece.coordinates.forEach(c => grid[c.y][c.x] = 0);
    activePiece.location.x += dx;
    activePiece.location.y += dy;
    activePiece.coordinates = activePiece.coordinates.map(c => {
        return { x: c.x + dx, y: c.y + dy }
    });
    activePiece.coordinates.forEach(c => grid[c.y][c.x] = activePiece.id);
    activePiece.activeRotation = false;

    let pendingMovement = state.meta.pendingMovement;
    if (dx > 0 && dy == 0) {
        let distance = dx;
        if (pendingMovement?.classifier == PendingMovement.Classifier.RightShift) {
            distance += pendingMovement.dx;
        }
        state.meta.activeRightShiftDistance += dx;
        state.meta.pendingMovement = PendingMovement.RightShift(distance);
    } else if (dx < 0 && dy == 0) {
        let distance = -dx;
        if (pendingMovement?.classifier == PendingMovement.Classifier.LeftShift) {
            distance += pendingMovement.dx;
        }
        state.meta.activeLeftShiftDistance += dx;
        state.meta.pendingMovement = PendingMovement.LeftShift(distance);
    } else if (dy > 0 && dx == 0) {
        let distance = dy;
        if (pendingMovement?.classifier == PendingMovement.Classifier.SoftDrop) {
            distance += pendingMovement.dy;
        }
        state.meta.activeDropDistance += dy;
        state.meta.pendingMovement = PendingMovement.SoftDrop(distance);
    }
})