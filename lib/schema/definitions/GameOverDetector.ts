import CoreState from "../../core/definitions/CoreState"
import Coordinate from "../../definitions/Coordinate"
import GameOverCheckType from "./GameOverCheckType"

interface GameOverDetector {
    isGameOver: <S extends CoreState>(params: GameOverDetector.Params<S>) => boolean
}

namespace GameOverDetector {

    export interface Params<S extends CoreState> {
        checkType: GameOverCheckType
        coordinates: Coordinate[]
        coreState: S
    }

}

export default GameOverDetector