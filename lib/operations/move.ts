import { willCollide } from "../util/stateUtils";
import Operation from "../definitions/CoreOperation";
import PendingMovement from "../definitions/PendingMovement";
import Cell from "../definitions/Cell";

/**
 * Moves the active piece by the specified x/y offset if the new coordinates are unoccupied and within the playfield
 */
export default (dx: number, dy: number) => Operation.Util.requireActiveGame(
    Operation.Provide(({ state }, { schema }) => {
        if (dx == 0 && dy == 0) {
            return Operation.None;
        }
        let { activePiece, playfieldGrid } = state;
        let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
        let collision = willCollide(collisionPrereqisites, activePiece.coordinates, dx, dy);
        return move(dx, dy).applyIf(!collision);
    })
)

let move = (dx: number, dy: number) => Operation.Draft(({ state }) => {
    let { activePiece, playfieldGrid } = state;
    activePiece.coordinates.forEach(c => playfieldGrid[c.y][c.x] = Cell.Empty);
    activePiece.location.x += dx;
    activePiece.location.y += dy;
    activePiece.coordinates = activePiece.coordinates.map(c => {
        return { x: c.x + dx, y: c.y + dy }
    });
    activePiece.coordinates.forEach(c => playfieldGrid[c.y][c.x] = Cell.Mino(activePiece.id));
    activePiece.activeRotation = false;

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