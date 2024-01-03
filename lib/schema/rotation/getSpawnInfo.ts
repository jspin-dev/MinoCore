import PieceIdentifier from "../../definitions/PieceIdentifier"
import CoreState from "../../core/definitions/CoreState"
import GeneratedGrids from "./definitions/GeneratedGrids"
import PieceSpec from "../definitions/PieceSpec"
import PieceSpawnInfo from "../definitions/PieceSpawnInfo";

export default (pieces: { [id: PieceIdentifier]: PieceSpec }) => {
    return (params: { pieceId: PieceIdentifier, state: CoreState & GeneratedGrids }): PieceSpawnInfo  => {
        let { spawnOrientation, startLocation } = pieces[params.pieceId]
        return {
            grid: params.state.generatedGrids[params.pieceId][spawnOrientation],
            orientation: spawnOrientation,
            location: startLocation
        }
    }
}