import BinaryGrid from "../../definitions/BinaryGrid"
import Coordinate from "../../definitions/Coordinate"
import CoreDependencies from "../../coreOperations/definitions/CoreDependencies"
import CoreState from "../../coreOperations/definitions/CoreState"
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

    export interface PieceGenerationResult {
        newPieces: PieceIdentifier[]
        randomNumbersUsed: number[]
    }

    export interface PieceGenerator {
        generateToFill: (state: CoreState, dependencies: CoreDependencies) => PieceGenerationResult
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

export default GameSchema;