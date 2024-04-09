import Coordinate from "../definitions/Coordinate"
import Cell from "../definitions/Cell"
import type Playfield from "../definitions/Playfield"
import PieceIdentifier from "../definitions/PieceIdentifier"

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

export const mapPlayfield = (params: { playfield: Playfield, map: (cell: Cell, coordinate: Coordinate) => Cell }) => {
    return params.playfield.reduce((accum, row, y) => {
        let newRow = row.reduce((rowAccum, cell, x) => [ ...rowAccum, params.map(cell, { x, y }) ], [])
        return [ ...accum, newRow ]
    }, [] as Playfield)
}

export const updateActivePlayfield = (params: {
    playfield: Playfield,
    activePieceCoordinates: Coordinate[],
    pieceId: PieceIdentifier
}) => {
    return mapPlayfield({
        playfield: params.playfield,
        map: (cell: Cell, coordinate: Coordinate) => {
            let shouldBeActive = params.activePieceCoordinates.some(c => Coordinate.equal(c, coordinate))
            if (Cell.isActive(cell)) {
                return shouldBeActive ? cell : Cell.Empty
            } else {
                return shouldBeActive ? Cell.Active(params.pieceId) : cell
            }
        }
    })
}