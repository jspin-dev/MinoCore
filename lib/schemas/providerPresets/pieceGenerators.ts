import PieceIdentifier from "../../definitions/PieceIdentifier"
import GameSchema from "../definitions/GameSchema"

namespace PieceGeneratorPresets {

    export let random: GameSchema.PieceGenerator = {
        generate: (minPieceCount: number, schemaPieces: [PieceIdentifier], rns: number[]) => {
            let randomNums = rns.slice(-minPieceCount)
            let pieces = Array.from(Array(minPieceCount).keys()).map(i => {
                let rndNum = Math.floor(randomNums[i] * schemaPieces.length)
                return schemaPieces[rndNum]
            })
            let remainingNums = rns.slice(0, -minPieceCount)
            return { newPieces: pieces, updatedRns: remainingNums }
        }
    }
    
}

export default PieceGeneratorPresets;