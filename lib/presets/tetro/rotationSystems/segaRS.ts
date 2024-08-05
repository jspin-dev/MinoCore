import Orientation from "../../../definitions/Orientation"
import RotationSystem from "../../../schema/rotation/definitions/RotationSystem"
import TetroPiece from "../TetroPiece"
import RotationMethods from "../../../schema/rotation/rotationMethods"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import BoundingBoxOffsets from "../../../schema/rotation/definitions/BoundingBoxOffsets"
import shapes from "../tetroShapes"

const defaults = (id: PieceIdentifier) => {
    return {
        id,
        shape: shapes[id],
        startLocation: { x: 3, y: 19 },
        spawnOrientation: Orientation.South,
        offsets: offsets[id]
    }
}

const offsets: { [id: PieceIdentifier]: BoundingBoxOffsets } = {
    [TetroPiece.O]: BoundingBoxOffsets.None,
    [TetroPiece.T]: BoundingBoxOffsets.None,
    [TetroPiece.J]: {
        [Orientation.North]: [0, 1],
        [Orientation.East]: [0, 0],
        [Orientation.South]: [0, 0],
        [Orientation.West]: [0, 0]
    },
    [TetroPiece.L]: {
        [Orientation.North]: [0, 1],
        [Orientation.East]: [0, 0],
        [Orientation.South]: [0, 0],
        [Orientation.West]: [0, 0]
    },
    [TetroPiece.S]: {
        [Orientation.North]: [0, 1],
        [Orientation.East]: [-1, 0],
        [Orientation.South]: [0, 0],
        [Orientation.West]: [0, 0]
    },
    [TetroPiece.Z]: {
        [Orientation.North]: [0, 1],
        [Orientation.East]: [0, 0],
        [Orientation.South]: [0, 0],
        [Orientation.West]: [1, 0]
    },
    [TetroPiece.I]: {
        [Orientation.North]: [0, 0],
        [Orientation.East]: [0, 0],
        [Orientation.South]: [0, -1],
        [Orientation.West]: [1, 0]
    }
}

export default {
    pieces: [
        defaults(TetroPiece.J),
        defaults(TetroPiece.L),
        defaults(TetroPiece.S),
        defaults(TetroPiece.Z),
        defaults(TetroPiece.T),
        defaults(TetroPiece.I),
        { ...defaults(TetroPiece.O), startLocation: { x: 4, y: 20 } }
    ],
    rotate: RotationMethods.basic(),
} satisfies RotationSystem.Basis
