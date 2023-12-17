import GameSchema from "../definitions/GameSchema"
import Orientation from "../definitions/Orientation";
import TetroPiece from "../definitions/TetroPiece";
import schemaDefaults from "./common/schemaTetroDefaults";
import shapes from "./common/tetroShapes";

let defaults: GameSchema.PieceDefinition.Defaults = {
    startLocation: { x: 3, y: 19 },
    spawnOrientation: Orientation.South,
    offsets: schemaDefaults.offsets,
    rotationValidator: schemaDefaults.rotationValidator,
    kickTable: schemaDefaults.kickTable
}

let schema: GameSchema = {
    playfield: schemaDefaults.playfield,
    pieces: { 
        [TetroPiece.J]: GameSchema.PieceDefinition.build({ 
            id: TetroPiece.J, 
            shape: shapes[TetroPiece.J], 
            offsets: {
                [Orientation.North]: [0, 1],
                [Orientation.East]: [0, 0],
                [Orientation.South]: [0, 0],
                [Orientation.West]: [0, 0]
            } 
        }, defaults),
        [TetroPiece.L]: GameSchema.PieceDefinition.build({ 
            id: TetroPiece.L, 
            shape: shapes[TetroPiece.L] ,
            offsets: {
                [Orientation.North]: [0, 1],
                [Orientation.East]: [0, 0],
                [Orientation.South]: [0, 0],
                [Orientation.West]: [0, 0]
            }
        }, defaults),
        [TetroPiece.S]: GameSchema.PieceDefinition.build({ 
            id: TetroPiece.S, 
            shape: shapes[TetroPiece.S],
            offsets: {
                [Orientation.North]: [0, 1],
                [Orientation.East]: [-1, 0],
                [Orientation.South]: [0, 0],
                [Orientation.West]: [0, 0]
            }
        }, defaults),
        [TetroPiece.Z]: GameSchema.PieceDefinition.build({ 
            id: TetroPiece.Z, 
            shape: shapes[TetroPiece.Z],
            offsets: {
                [Orientation.North]: [0, 1],
                [Orientation.East]: [0, 0],
                [Orientation.South]: [0, 0],
                [Orientation.West]: [1, 0]
            } 
        }, defaults),
        [TetroPiece.T]: GameSchema.PieceDefinition.build({ id: TetroPiece.T, shape: shapes[TetroPiece.T] }, defaults),
        [TetroPiece.I]: GameSchema.PieceDefinition.build({
            id: TetroPiece.I,
            shape: shapes[TetroPiece.I],
            offsets: {
                [Orientation.North]: [0, 0],
                [Orientation.East]: [0, 0],
                [Orientation.South]: [0, -1],
                [Orientation.West]: [1, 0]
            }
        }, defaults),
        [TetroPiece.O]: GameSchema.PieceDefinition.build({ 
            id: TetroPiece.O,
            shape: shapes[TetroPiece.O],
            startLocation: { x: 4, y: 20 }
        }, defaults)
    }
}

export default schema;