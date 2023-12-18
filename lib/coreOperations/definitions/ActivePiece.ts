import Coordinate from "../../definitions/Coordinate"
import PieceIdentitifier from "../../definitions/PieceIdentifier"
import Orientation from "../../definitions/Orientation"

interface ActivePiece {
    id: PieceIdentitifier
    location: Coordinate
    coordinates: Coordinate[]
    ghostCoordinates: Coordinate[]
    orientation: Orientation,
    distanceToFloor: number
}

namespace ActivePiece {

    export let initial: ActivePiece = {
        id: null,
        location: null,
        coordinates: [],
        ghostCoordinates: [],
        orientation: null,
        distanceToFloor: null
    }

}

export default ActivePiece