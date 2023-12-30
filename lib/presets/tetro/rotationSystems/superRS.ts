import Orientation from "../../../definitions/Orientation"
import RotationSystem from "../../../schema/rotation/definitions/RotationSystem"
import TetroPiece from "../TetroPiece"
import KickTable from "../../../schema/rotation/definitions/KickTable"
import RotationMethods from "../../../schema/rotation/rotationMethods"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import BoundingBoxOffsets from "../../../schema/rotation/definitions/BoundingBoxOffsets"
import PieceSpec from "../../../schema/definitions/PieceSpec"
import shapes from "../tetroShapes"
import initializeRs from "../../../schema/rotation/initializeRs"
import getSpawnInfo from "../../../schema/rotation/getSpawnInfo"

let buildSpec = (id: PieceIdentifier, optionalParams?: PieceSpec.OptionalParams): PieceSpec => {
    return {
        id,
        shape: shapes[id],
        startLocation: optionalParams?.startLocation ?? { x: 3, y: 18 },
        spawnOrientation: optionalParams?.spawnOrientation ?? Orientation.North,
        offsets: optionalParams?.offsets ?? BoundingBoxOffsets.None
    }
}

let defaultTable: KickTable = {
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

let iTable: KickTable = {
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

let kickTables: KickTable.FullInfo = {
    [TetroPiece.J]: { table: defaultTable },
    [TetroPiece.L]: { table: defaultTable },
    [TetroPiece.S]: { table: defaultTable },
    [TetroPiece.Z]: { table: defaultTable },
    [TetroPiece.T]: { table: defaultTable },
    [TetroPiece.O]: { table: defaultTable },
    [TetroPiece.I]: { table: iTable }
}

let pieces: { [id: PieceIdentifier]: PieceSpec } = {
    [TetroPiece.J]: buildSpec(TetroPiece.J),
    [TetroPiece.L]: buildSpec(TetroPiece.L),
    [TetroPiece.S]: buildSpec(TetroPiece.S),
    [TetroPiece.Z]: buildSpec(TetroPiece.Z),
    [TetroPiece.T]: buildSpec(TetroPiece.T),
    [TetroPiece.I]: buildSpec(TetroPiece.I),
    [TetroPiece.O]: buildSpec(TetroPiece.O, { startLocation: { x: 4, y: 18 } })
}

let rotationSystem: RotationSystem = {
    initialize: initializeRs(pieces),
    rotate: RotationMethods.kickTable(kickTables),
    getSpawnInfo: getSpawnInfo(pieces)
}

export default rotationSystem