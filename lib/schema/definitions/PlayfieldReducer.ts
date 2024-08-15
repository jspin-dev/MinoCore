import Playfield from "../../definitions/Playfield"
import CoreState from "../../core/definitions/CoreState"
import GameSchema from "./GameSchema"

interface PlayfieldReducer {

    reduce: <S extends CoreState>(params: PlayfieldReducer.InputParams<S>) => PlayfieldReducer.Result

}

namespace PlayfieldReducer {

    export interface InputParams<S> {
        coreState: S
        schema: GameSchema
    }

    export interface Result {
        playfield: Playfield
        linesCleared: number[]
    }

}

export default PlayfieldReducer