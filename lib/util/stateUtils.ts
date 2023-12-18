import Grid from "../definitions/Grid";
import Coordinate from "../definitions/Coordinate";
import Cell from "../coreOperations/definitions/Cell";
import GameSchema from "../schemas/definitions/GameSchema";

/**
 * Determines if any member of a set of coordinates with a specified x/y offset will collide with a non-active block
 * (one that is not part of the current active piece)
 */
export let willCollide = (
    playfieldGrid: Grid<Cell>,
    playfieldSpec: GameSchema.PlayfieldSpec,
    coordinates: Readonly<Coordinate[]>, 
    dx: number, 
    dy: number
) => {
    return coordinates.some(c => {
        let x = c.x + dx;
        let y = c.y + dy;
        if (x >= playfieldSpec.columns || x < 0 || y >= playfieldSpec.rows || y < 0) {
            return true;
        }
        return Cell.isLocked(playfieldGrid[y][x]);
    }); 
}

