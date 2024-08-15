import type PieceIdentifier from "../../definitions/PieceIdentifier"

interface PieceGenerator {
    refill: (params: PieceGenerator.RefillParams) => PieceGenerator.RefillParams
    rnsRequirement: number
    minQueueLength: number
}

namespace PieceGenerator {

    export interface RefillParams {
        pieces: PieceIdentifier[]
        rns: number[]
    }

}

export default PieceGenerator