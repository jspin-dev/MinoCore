import Coordinate from "./Coordinate"
import PieceIdentitifier from "./PieceIdentifier"
import Orientation from "./Orientation"

interface ActivePiece {
    id: PieceIdentitifier
    location: Coordinate
    coordinates: Coordinate[]
    ghostCoordinates: Coordinate[]
    orientation: Orientation
}

namespace ActivePiece {

    export let initial: ActivePiece = {
        id: null,
        location: null,
        coordinates: [],
        ghostCoordinates: [],
        orientation: null
    }

}

export default ActivePiece