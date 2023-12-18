import Coordinate from "../../definitions/Coordinate";
import GameSchema from "../definitions/GameSchema"
import Orientation from "../../definitions/Orientation";
import PieceIdentifier from "../../definitions/PieceIdentifier";
import TetroPiece from "../definitions/TetroPiece";
import PieceGeneratorPresets from "../presets/pieceGenerators";
import classicRS from "../rotationSystems/nintendoRS";
import shapes from "../shapes/tetroShapes";

let buildDefinition = (
    pieceId: PieceIdentifier, 
    startLocation?: Coordinate
): GameSchema.PieceDefinition => {
    return {
        id: pieceId,
        shape: shapes[pieceId],
        startLocation: startLocation ?? { x: 3, y: 19 },
        spawnOrientation: Orientation.South
    }
}

let schema: GameSchema = {
    playfield: GameSchema.PlayfieldSpec.guidelineDefault,
    pieceGenerator: PieceGeneratorPresets.random,
    rotationSystem: classicRS,
    pieces: { 
        [TetroPiece.J]: buildDefinition(TetroPiece.J),
        [TetroPiece.L]: buildDefinition(TetroPiece.L),
        [TetroPiece.S]: buildDefinition(TetroPiece.S),
        [TetroPiece.Z]: buildDefinition(TetroPiece.Z),
        [TetroPiece.T]: buildDefinition(TetroPiece.T),
        [TetroPiece.I]: buildDefinition(TetroPiece.I),
        [TetroPiece.O]: buildDefinition(TetroPiece.O, { x: 4, y: 20 })
    }
}

export default schema;