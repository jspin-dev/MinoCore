import Cell from "../../definitions/Cell"
import GhostProvider from "../definitions/GhostProvider"
import Coordinate from "../../definitions/Coordinate";
import {mapPlayfield} from "../../util/stateUtils";

export default {

    noGhost: {
        refresh: s => { return { playfield: s.playfield, ghostCoordinates: [] } }
    } satisfies GhostProvider,

    classic: {
        refresh: state => {
            let clearedPlayfield = mapPlayfield({
                playfield: state.playfield,
                map: cell => Cell.isGhost(cell) ? Cell.Empty : cell
            })
            const ghostCoordinates = state.activePiece.coordinates
                .map(c => { return { x: c.x, y: c.y + state.activePiece.availableDropDistance } })
                .filter(c => Cell.isEmpty(clearedPlayfield[c.y][c.x]))
            let finalPlayfield = mapPlayfield({
                playfield: clearedPlayfield,
                map: (cell, coordinate: Coordinate) => {
                    const isGhostCell = ghostCoordinates.some(c => Coordinate.equal(coordinate, c))
                    return isGhostCell ? Cell.Ghost(state.activePiece.id) : cell
                }
            })
            return { playfield: finalPlayfield, ghostCoordinates }
        }
    } satisfies GhostProvider

}
