import GameSchema from "../definitions/GameSchema";
import Orientation from "../definitions/Orientation";
import TetroPiece from "../definitions/TetroPiece";
import schemaDefaults from "./common/schemaTetroDefaults";
import shapes from "./common/tetroShapes";

let defaults: GameSchema.PieceDefinition.Defaults = {
    startLocation: { x: 3, y: 18 },
    spawnOrientation: schemaDefaults.spawnOrientation,
    offsets: schemaDefaults.offsets,
    rotationValidator: schemaDefaults.rotationValidator,
    kickTable: {
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
}

let iKickTable: GameSchema.KickTable = {
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

let schema: GameSchema = {
    playfield: schemaDefaults.playfield,
    pieces: { 
        [TetroPiece.J]: GameSchema.PieceDefinition.build({ id: TetroPiece.J, shape: shapes[TetroPiece.J] }, defaults),
        [TetroPiece.L]: GameSchema.PieceDefinition.build({ id: TetroPiece.L, shape: shapes[TetroPiece.L] }, defaults),
        [TetroPiece.S]: GameSchema.PieceDefinition.build({ id: TetroPiece.S, shape: shapes[TetroPiece.S] }, defaults),
        [TetroPiece.Z]: GameSchema.PieceDefinition.build({ id: TetroPiece.Z, shape: shapes[TetroPiece.Z] }, defaults),
        [TetroPiece.T]: GameSchema.PieceDefinition.build({ id: TetroPiece.T, shape: shapes[TetroPiece.T] }, defaults),
        [TetroPiece.I]: GameSchema.PieceDefinition.build({
            id: TetroPiece.I,
            shape: shapes[TetroPiece.I],
            kickTable: iKickTable
        }, defaults),
        [TetroPiece.O]: GameSchema.PieceDefinition.build({ 
            id: TetroPiece.O,
            shape: shapes[TetroPiece.O],
            startLocation: { x: 4, y: 18 }
        }, defaults)
    }
}

export default schema;