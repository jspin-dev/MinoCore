import Grid from "../definitions/Grid";
import Coordinate from "../definitions/Coordinate";
import Cell from "../definitions/Cell";
import GameSchema from "../schemas/definitions/GameSchema";

/**
 * Determines if any member of a set of coordinates with a specified x/y offset will collide with a locked block
 * or the wall/floor
 */
export let willCollide = (playfield: Grid<Cell>, coordinates: Readonly<Coordinate[]>, dx: number, dy: number) => {
    return coordinates.some(c => {
        let x = c.x + dx
        let y = c.y + dy
        return playfield[y] && playfield[y][x] ? Cell.isLocked(playfield[y][x]) : true
    }); 
}
