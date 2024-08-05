import Orientation from "../../../definitions/Orientation"
import TetroPiece from "../TetroPiece"
import RotationMethods from "../../../schema/rotation/rotationMethods"
import BoundingBoxOffsets from "../../../schema/rotation/definitions/BoundingBoxOffsets"
import PieceSpec from "../../../schema/definitions/PieceSpec"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import RotationSystem from "../../../schema/rotation/definitions/RotationSystem"
import shapes from "../tetroShapes"

const defaults = (id: PieceIdentifier): PieceSpec.Basis => {
    return {
        id,
        shape: shapes[id],
        startLocation: { x: 3, y: 19 },
        spawnOrientation: Orientation.North,
        offsets: BoundingBoxOffsets.None
    }
}

const iszOffsets: BoundingBoxOffsets = {
    [Orientation.North]: [0, 1],
    [Orientation.East]: [0, 0],
    [Orientation.South]: [0, 0],
    [Orientation.West]: [1, 0]
}

export default {
    pieces: [
        { ...defaults(TetroPiece.J), spawnOrientation: Orientation.South },
        { ...defaults(TetroPiece.L), spawnOrientation: Orientation.South },
        { ...defaults(TetroPiece.S), offsets: iszOffsets },
        { ...defaults(TetroPiece.Z), offsets: iszOffsets },
        { ...defaults(TetroPiece.T), spawnOrientation: Orientation.South },
        { ...defaults(TetroPiece.I), startLocation: { x: 3, y: 18 }, offsets: iszOffsets },
        { ...defaults(TetroPiece.O), startLocation: { x: 4, y: 20 } }
    ],
    rotate: RotationMethods.basic()
} satisfies RotationSystem.Basis