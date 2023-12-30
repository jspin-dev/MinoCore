import PieceIdentifier from "../../definitions/PieceIdentifier"
import PieceGenerator from "../../schema/definitions/PieceGenerator"

namespace PieceGenerators {

    export let random = (minQueueLength: number, schemaPieces: PieceIdentifier[]): PieceGenerator => {
        return {
            refill: (pieces: PieceIdentifier[], rns: number[]): PieceGenerator.Result => {
                let pieceDeficit = minQueueLength - pieces.length
                if (pieceDeficit <= 0) {
                    return { pieces, rns }
                }
                let randomNums = rns.slice(-pieceDeficit)
                let newPieces = Array.from(Array(pieceDeficit).keys()).map(i => {
                    let rndNum = Math.floor(randomNums[i] * schemaPieces.length)
                    return schemaPieces[rndNum]
                })
                return {
                    pieces: [...pieces, ...newPieces],
                    rns: rns.slice(0, -pieceDeficit)
                }
            },
            rnsRequirement: minQueueLength
        }
    }

    export let randomBag = (minQueueLength: number, schemaPieces: PieceIdentifier[]): PieceGenerator => {
        return {
            refill: (pieces: PieceIdentifier[], rns: number[]): PieceGenerator.Result => {
                if (minQueueLength - pieces.length <= 0) {
                    return { pieces, rns }
                }
                let bagSize = schemaPieces.length
                let bagCount = Math.ceil(minQueueLength / bagSize)
                let initialResult: PieceGenerator.Result = { pieces: [...pieces], rns: [...rns] }
                return Array.from(Array(bagCount)).reduce((result, _) => {
                    return generateRandomizedBag(result, schemaPieces, bagSize)
                }, initialResult)
            },
            rnsRequirement: Math.ceil(minQueueLength / schemaPieces.length) * (schemaPieces.length - 1)
        }
    }

    let generateRandomizedBag = (
        cumulativeResult: PieceGenerator.Result,
        schemaPieces: PieceIdentifier[],
        bagSize: number
    ): PieceGenerator.Result => {
        let rns = [...cumulativeResult.rns]
        let bag = [...schemaPieces]
        let randomNumbers = rns.splice(1 - bagSize) // Takes the last n-1 numbers
        let pieces = [
            ...cumulativeResult.pieces,
            ...randomNumbers.map(randomNum => {
                let randomPieceIndex = Math.floor(randomNum * bag.length);
                return bag.splice(randomPieceIndex, 1)[0];
            }),
            bag[0]
        ]
        return { pieces, rns }
    }

}

export default PieceGenerators