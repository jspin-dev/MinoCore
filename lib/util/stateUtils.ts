import type Coordinate from "../definitions/Coordinate"
import Cell from "../definitions/Cell"
import type Playfield from "../definitions/Playfield"

/**
 * Determines if any member of a set of coordinates with a specified x/y offset will collide with a locked block
 * or the wall/floor
 */
export const willCollide = (playfield: Playfield, coordinates: Readonly<Coordinate[]>, dx: number, dy: number) => {
    return coordinates.some(c => {
        let x = c.x + dx
        let y = c.y + dy
        return playfield[y] && playfield[y][x] ? Cell.isLocked(playfield[y][x]) : true
    })
}
