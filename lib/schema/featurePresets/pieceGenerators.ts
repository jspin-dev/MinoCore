import PieceIdentifier from "../../definitions/PieceIdentifier"
import PieceGenerator from "../definitions/PieceGenerator"

namespace PieceGenerators {

    export const pureRandom = (minQueueLength: number, schemaPieces: PieceIdentifier[]) => {
        return {
            refill({ pieces, rns }) {
                const pieceDeficit = minQueueLength - pieces.length
                if (pieceDeficit <= 0) {
                    return { pieces, rns }
                }
                const randomNums = rns.slice(-pieceDeficit)
                const newPieces = Array.from(Array(pieceDeficit).keys()).map(i => {
                    const rndNum = Math.floor(randomNums[i] * schemaPieces.length)
                    return schemaPieces[rndNum]
                })
                return {
                    pieces: [...pieces, ...newPieces],
                    rns: rns.slice(0, -pieceDeficit)
                }
            },
            minQueueLength,
            rnsRequirement: minQueueLength
        } satisfies PieceGenerator
    }

    export const randomBag = (minQueueLength: number, schemaPieces: PieceIdentifier[]) => {
        return {
            refill({ pieces, rns }) {
                if (minQueueLength - pieces.length <= 0) {
                    return { pieces, rns }
                }
                const bagSize = schemaPieces.length
                const bagCount = Math.ceil(minQueueLength / bagSize)
                const initialResult: PieceGenerator.RefillParams = { pieces: [...pieces], rns: [...rns] }
                return Array.from(Array(bagCount)).reduce((result, _) => {
                    return generateRandomizedBag(result, schemaPieces, bagSize)
                }, initialResult)
            },
            minQueueLength,
            rnsRequirement: Math.ceil(minQueueLength / schemaPieces.length) * (schemaPieces.length - 1)
        } satisfies PieceGenerator
    }

    const generateRandomizedBag = (
        cumulativeResult: PieceGenerator.RefillParams,
        schemaPieces: PieceIdentifier[],
        bagSize: number
    ) => {
        const rns = [...cumulativeResult.rns]
        const bag = [...schemaPieces]
        const randomNumbers = rns.splice(1 - bagSize) // Takes the last n-1 numbers
        const pieces = [
            ...cumulativeResult.pieces,
            ...randomNumbers.map(randomNum => {
                let randomPieceIndex = Math.floor(randomNum * bag.length)
                return bag.splice(randomPieceIndex, 1)[0]
            }),
            bag[0]
        ]
        return { pieces, rns } satisfies PieceGenerator.RefillParams
    }

}

export default PieceGenerators