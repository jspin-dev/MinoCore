import CoreDependencies from "../../coreOperations/definitions/CoreDependencies"
import CoreState from "../../coreOperations/definitions/CoreState"
import GameSchema from "../definitions/GameSchema"
import TetroPiece from "../definitions/TetroPiece"

namespace PieceGeneratorPresets {

    export let random: GameSchema.PieceGenerator = {
        generateToFill: (state: CoreState, dependencies: CoreDependencies): GameSchema.PieceGenerationResult => {
            return {
                newPieces: [TetroPiece.I, TetroPiece.J, TetroPiece.O],
                randomNumbersUsed: []
            }
        }
    }
    
    export let nBag: GameSchema.PieceGenerator = {
        generateToFill: (state: CoreState, dependencies: CoreDependencies): GameSchema.PieceGenerationResult => {
            return {
                newPieces: [TetroPiece.I, TetroPiece.J, TetroPiece.O],
                randomNumbersUsed: []
            }
        }
    }

}

export default PieceGeneratorPresets;