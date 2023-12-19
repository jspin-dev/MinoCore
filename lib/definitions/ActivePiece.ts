import Coordinate from "./Coordinate"
import PieceIdentitifier from "./PieceIdentifier"
import Orientation from "./Orientation"
import ShiftDirection from "./ShiftDirection"

interface ActivePiece {
    id: PieceIdentitifier
    location: Coordinate
    coordinates: Coordinate[]
    ghostCoordinates: Coordinate[]
    orientation: Orientation
    availableDropDistance: number
    availableShiftDistance: {
        [ShiftDirection.Left]: number,
        [ShiftDirection.Right]: number
    }
}

namespace ActivePiece {

    export let initial: ActivePiece = {
        id: null,
        location: null,
        coordinates: [],
        ghostCoordinates: [],
        orientation: null,
        availableDropDistance: null,
        availableShiftDistance: null
    }

}

export default ActivePiece