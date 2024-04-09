import Coordinate from "../../definitions/Coordinate"
import CoreReducerResult from "../../core/definitions/CoreReducerResult"
import CoreState from "../../core/definitions/CoreState"
import Playfield from "../../definitions/Playfield"

interface GhostProvider {
    calculateCoordinates: <S extends CoreState>(result: CoreReducerResult<S>) => Coordinate[],
    refresh: <S extends CoreState>(state: S) => { playfield: Playfield, ghostCoordinates: Coordinate[] }
}

export default GhostProvider