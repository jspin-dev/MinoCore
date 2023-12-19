import BinaryGrid from "../../definitions/BinaryGrid"
import Coordinate from "../../definitions/Coordinate"
import Orientation from "../../definitions/Orientation"
import PieceIdentifier from "../../definitions/PieceIdentifier"
import RotationSystem from "./RotationSystem"

interface GameSchema {
    playfield: GameSchema.PlayfieldSpec
    pieceGenerator: GameSchema.PieceGenerator
    rotationSystem: RotationSystem,
    pieces: { [id: PieceIdentifier]: GameSchema.PieceDefinition }
}

namespace GameSchema {

    export interface PieceGenerator {
        generate: (minPieceCount: number, schemaPieces: PieceIdentifier[], rns: number[]) => PieceGenerationResult
    }

    export interface PlayfieldSpec {
        rows: number
        columns: number
        ceiling: number
    }

    export namespace PlayfieldSpec {

        export let guidelineDefault = { columns: 10, rows: 40, ceiling: 20 }

    }

    export interface PieceDefinition {
        id: PieceIdentifier
        shape: BinaryGrid
        startLocation: Coordinate
        spawnOrientation: Orientation
    }

}

namespace GameSchema {

    export interface PieceGenerationResult {
        newPieces: PieceIdentifier[]
        updatedRns: number[]
    }

}

export default GameSchema;