import { willCollide } from "../util/stateUtils";
import Operation from "../definitions/Operation";

/**
 * Moves the active piece by the specified x/y offset if the new coordinates are unoccupied and within the playfield
 */
export default (dx: number, dy: number) => {
    return Operation.Provide(({ state }) => {
        if (dx == 0 && dy == 0) {
            return Operation.None;
        }
        let collision = willCollide(state.playfield.activePiece.coordinates, dx, dy, state.playfield, state.settings);
        return Operation.applyIf(!collision, move(dx, dy));
    }, {
        description: "Checking for collision and moving only if allowed",
        strict: true
    })
}

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

    if (dx > 0) {
        state.meta.activeRightShiftDistance += dx;
    } else if (dx < 0) {
        state.meta.activeLeftShiftDistance += dx;
    } else if (dy > 0) {
        state.meta.activeDropDistance += dy;
    }
}, {
    description: "Moving piece",
    strict: true
})
