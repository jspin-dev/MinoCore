import Orientation from "../../../definitions/Orientation"
import RotationSystem from "../../../schema/rotation/definitions/RotationSystem"
import TetroPiece from "../TetroPiece"
import KickTable from "../../../schema/rotation/definitions/KickTable"
import RotationMethods from "../../../schema/rotation/rotationMethods"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import BoundingBoxOffsets from "../../../schema/rotation/definitions/BoundingBoxOffsets"
import shapes from "../tetroShapes"

const defaults = (id: PieceIdentifier) => {
    return {
        id,
        shape: shapes[id],
        startLocation: { x: 3, y: 18 },
        spawnOrientation: Orientation.North,
        offsets: BoundingBoxOffsets.None
    }
}

const defaultTable: KickTable = {
    [Orientation.North]: {
        [Orientation.North]: [],
        [Orientation.East]: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        [Orientation.South]: [[0, 0], [0, -1]],
        [Orientation.West]: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
    },
    [Orientation.East]: {
        [Orientation.North]: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        [Orientation.East]: [],
        [Orientation.South]: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        [Orientation.West]: [[0, 0], [1, 0]]
    },
    [Orientation.South]: {
        [Orientation.North]: [[0, 0], [0, 1]],
        [Orientation.East]: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        [Orientation.South]: [],
        [Orientation.West]: [[0, 0], [-1, 0], [1, -1], [0, 2], [1, 2]]
    },
    [Orientation.West]: {
        [Orientation.North]: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        [Orientation.East]: [[0, 0], [-1, 0]],
        [Orientation.South]: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        [Orientation.West]: []
    }
}

const iTable: KickTable = {
    [Orientation.North]: {
        [Orientation.North]: [],
        [Orientation.East]: [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
        [Orientation.South]: [[0, 0], [0, -1]],
        [Orientation.West]: [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]
    },
    [Orientation.East]: {
        [Orientation.North]: [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
        [Orientation.East]: [],
        [Orientation.South]: [[0, 0], [-1, 0], [2, 0], [1, -2], [-2, 1]],
        [Orientation.West]: [[0, 0], [1, 0]]
    },
    [Orientation.South]: {
        [Orientation.North]: [[0, 0], [0, 1]],
        [Orientation.East]: [[0, 0], [1, 0], [-2, 0], [-1, 2], [2, -1]],
        [Orientation.South]: [],
        [Orientation.West]: [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]]
    },
    [Orientation.West]: {
        [Orientation.North]: [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
        [Orientation.East]: [[0, 0], [-1, 0]],
        [Orientation.South]: [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
        [Orientation.West]: []
    }
}

const kickTables: KickTable.FullInfo = {
    [TetroPiece.J]: { table: defaultTable },
    [TetroPiece.L]: { table: defaultTable },
    [TetroPiece.S]: { table: defaultTable },
    [TetroPiece.Z]: { table: defaultTable },
    [TetroPiece.T]: { table: defaultTable },
    [TetroPiece.O]: { table: defaultTable },
    [TetroPiece.I]: { table: iTable }
}

export default {
    pieces: [
        defaults(TetroPiece.J),
        defaults(TetroPiece.L),
        defaults(TetroPiece.S),
        defaults(TetroPiece.Z),
        defaults(TetroPiece.T),
        defaults(TetroPiece.I),
        { ...defaults(TetroPiece.O), startLocation: { x: 4, y: 18 } }
    ],
    rotate: RotationMethods.kickTable(kickTables),
} satisfies RotationSystem.Basis