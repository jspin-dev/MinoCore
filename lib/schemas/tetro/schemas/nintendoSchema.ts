import Coordinate from "../../../definitions/Coordinate";
import GameSchema from "../../definitions/GameSchema";
import Orientation from "../../../definitions/Orientation";
import PieceIdentifier from "../../../definitions/PieceIdentifier";
import TetroPiece from "../TetroPiece";
import PieceGeneratorPresets from "../../providerPresets/pieceGenerators";
import nrs from "../rotationSystems/nintendoRS";
import shapes from "../tetroShapes";

let buildDefinition = (
    pieceId: PieceIdentifier, 
    spawnOrientation?: Orientation,
    startLocation?: Coordinate
): GameSchema.PieceDefinition => {
    return {
        id: pieceId,
        shape: shapes[pieceId],
        startLocation: startLocation ?? { x: 3, y: 19 },
        spawnOrientation: spawnOrientation ?? Orientation.North
    }
}

let schema: GameSchema = {
    playfield: GameSchema.PlayfieldSpec.guidelineDefault,
    pieceGenerator: PieceGeneratorPresets.random,
    rotationSystem: nrs,
    pieces: { 
        [TetroPiece.J]: buildDefinition(TetroPiece.J, Orientation.South),
        [TetroPiece.L]: buildDefinition(TetroPiece.L, Orientation.South),
        [TetroPiece.S]: buildDefinition(TetroPiece.S),
        [TetroPiece.Z]: buildDefinition(TetroPiece.Z),
        [TetroPiece.T]: buildDefinition(TetroPiece.T, Orientation.South),
        [TetroPiece.I]: buildDefinition(TetroPiece.I, undefined, { x: 3, y: 18 }),
        [TetroPiece.O]: buildDefinition(TetroPiece.O, undefined, { x: 4, y: 20 })
    }
}

export default schema;