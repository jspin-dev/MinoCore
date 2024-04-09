import CoreState from "../../core/definitions/CoreState"
import CoreReducerResult from "../../core/definitions/CoreReducerResult"
import Coordinate from "../../definitions/Coordinate"
import GameOverCheckType from "./GameOverCheckType"

export default interface GameOverDetector {

    isGameOver: <S extends CoreState>(
        params: {
            checkType: GameOverCheckType,
            coordinates: Coordinate[],
            result: CoreReducerResult<S>
        }
    ) => boolean

}
