import type Coordinate from "./Coordinate"
import type PieceIdentifier from "./PieceIdentifier"
import type Orientation from "./Orientation"
import ShiftDirection from "./ShiftDirection"

interface ActivePiece {
    id: PieceIdentifier
    location: Coordinate
    coordinates: Coordinate[]
    ghostCoordinates: Coordinate[]
    orientation: Orientation,
    maxDepth: number,
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
        maxDepth: 0,
        availableDropDistance: null,
        availableShiftDistance: null
    }

}

export default ActivePiece