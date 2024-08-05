import Coordinate from "../../definitions/Coordinate"
import CoreState from "../../core/definitions/CoreState"
import Playfield from "../../definitions/Playfield"

interface GhostProvider {
    refresh: <S extends CoreState>(state: S) => GhostProvider.Result
}

namespace GhostProvider {

    export interface Result {
        playfield: Playfield
        ghostCoordinates: Coordinate[]
    }

}

export default GhostProvider