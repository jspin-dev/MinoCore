import GameSchema from "../definitions/GameSchema";
import Orientation from "../definitions/Orientation";
import TetroPiece from "../definitions/TetroPiece";
import schemaDefaults from "./common/schemaTetroDefaults";
import shapes from "./common/tetroShapes";

let defaults: GameSchema.PieceDefinition.Defaults = {
    startLocation: { x: 3, y: 19 },
    spawnOrientation: schemaDefaults.spawnOrientation,
    offsets: schemaDefaults.offsets,
    rotationValidator: schemaDefaults.rotationValidator,
    kickTable: schemaDefaults.kickTable
}

let iszOffsets: GameSchema.PureOrientationOffsets = {
    [Orientation.North]: [0, 1],
    [Orientation.East]: [0, 0],
    [Orientation.South]: [0, 0],
    [Orientation.West]: [1, 0]
}

let schema: GameSchema = {
    playfield: schemaDefaults.playfield,
    pieces: { 
        [TetroPiece.J]: GameSchema.PieceDefinition.build({
            id: TetroPiece.J,
            shape: shapes[TetroPiece.J],
            spawnOrientation: Orientation.South
        }, defaults),
        [TetroPiece.L]: GameSchema.PieceDefinition.build({
            id: TetroPiece.L,
            shape: shapes[TetroPiece.L],
            spawnOrientation: Orientation.South
        }, defaults),
        [TetroPiece.S]: GameSchema.PieceDefinition.build({
            id: TetroPiece.S,
            shape: shapes[TetroPiece.S],
            offsets: iszOffsets
        }, defaults),
        [TetroPiece.Z]: GameSchema.PieceDefinition.build({
            id: TetroPiece.Z,
            shape: shapes[TetroPiece.Z],
            offsets: iszOffsets
        }, defaults),
        [TetroPiece.T]: GameSchema.PieceDefinition.build({
            id: TetroPiece.T,
            shape: shapes[TetroPiece.T],
            spawnOrientation: Orientation.South
        }, defaults),
        [TetroPiece.I]: GameSchema.PieceDefinition.build({
            id: TetroPiece.I,
            shape: shapes[TetroPiece.I],
            startLocation: { x: 3, y: 18 },
            offsets: iszOffsets
        }, defaults),
        [TetroPiece.O]: GameSchema.PieceDefinition.build({ 
            id: TetroPiece.O,
            shape: shapes[TetroPiece.O],
            startLocation: { x: 4, y: 20 }
        }, defaults)
    }
}

export default schema;