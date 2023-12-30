import type PieceIdentifier from "../../definitions/PieceIdentifier"
import type BinaryGrid from "../../definitions/BinaryGrid"
import type Coordinate from "../../definitions/Coordinate"
import BoundingBoxOffsets from "../rotation/definitions/BoundingBoxOffsets"
import Orientation from "../../definitions/Orientation"

interface PieceSpec {
    id: PieceIdentifier
    shape: BinaryGrid
    startLocation: Coordinate
    spawnOrientation: Orientation
    offsets: BoundingBoxOffsets
}

namespace PieceSpec {

    export interface OptionalParams {
        shape?: BinaryGrid
        startLocation?: Coordinate
        spawnOrientation?: Orientation
        offsets?: BoundingBoxOffsets
    }

}

export default PieceSpec