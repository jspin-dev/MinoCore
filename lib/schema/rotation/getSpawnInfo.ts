import PieceIdentifier from "../../definitions/PieceIdentifier"
import CoreState from "../../core/definitions/CoreState"
import GeneratedGrids from "./definitions/GeneratedGrids"
import PieceSpec from "../definitions/PieceSpec"

export default (pieces: { [id: PieceIdentifier]: PieceSpec }) => {
    return (pieceId: PieceIdentifier, state: CoreState & GeneratedGrids) => {
        let { spawnOrientation, startLocation } = pieces[pieceId]
        return {
            grid: state.generatedGrids[pieceId][spawnOrientation],
            orientation: spawnOrientation,
            location: startLocation
        }
    }
}