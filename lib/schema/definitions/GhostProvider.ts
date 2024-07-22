import Coordinate from "../../definitions/Coordinate"
import CoreState from "../../core/definitions/CoreState"
import Playfield from "../../definitions/Playfield"

interface GhostProvider {
    refresh: <S extends CoreState>(state: S) => { playfield: Playfield, ghostCoordinates: Coordinate[] }
}

export default GhostProvider