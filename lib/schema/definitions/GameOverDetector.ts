import CoreState from "../../core/definitions/CoreState"
import CoreOperationResult from "../../core/definitions/CoreOperationResult"
import Coordinate from "../../definitions/Coordinate"
import GameOverCheckType from "./GameOverCheckType"

export default interface GameOverDetector {

    isGameOver: <S extends CoreState>(
        params: {
            checkType: GameOverCheckType,
            coordinates: Coordinate[],
            coreState: S
        }
    ) => boolean

}
