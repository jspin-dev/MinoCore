import PieceIdentifier from "../../../definitions/PieceIdentifier"
import Operation from "../../definitions/CoreOperation"
import Coordinate from "../../../definitions/Coordinate"
import Cell from "../../../definitions/Cell"

namespace ConvenienceOps {

    export const setPreviewQueue = (pieces: PieceIdentifier[]) => Operation.Draft(({ state }) => {
        state.previewQueue = pieces
    })

    export const setHoldPiece = (piece: PieceIdentifier) => Operation.Draft(({ state }) => {
        state.holdPiece = piece
    })

    export const setPlayfieldCell = (coordinate: Coordinate, value: Cell) => Operation.Draft(({ state }) => {
        state.playfield[coordinate.y][coordinate.x] = value
    })

}

export default ConvenienceOps
