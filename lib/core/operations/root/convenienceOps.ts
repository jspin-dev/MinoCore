import PieceIdentifier from "../../../definitions/PieceIdentifier"
import Operation from "../../definitions/CoreOperation"
import Coordinate from "../../../definitions/Coordinate"
import Cell from "../../../definitions/Cell"

namespace ConvenienceOps {

    export let setPreviewQueue = (pieces: PieceIdentifier[]) => Operation.Draft(({ state }) => {
        state.previewQueue = pieces
    })

    export let setHoldPiece = (piece: PieceIdentifier) => Operation.Draft(({ state }) => {
        state.holdPiece = piece
    })

    export let setPlayfieldCell = (coordinate: Coordinate, value: Cell) => Operation.Draft(({ state }) => {
        state.playfield[coordinate.y][coordinate.x] = value
    })

}

export default ConvenienceOps
