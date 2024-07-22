import Playfield from "../../definitions/Playfield"
import type PlayfieldDimens from "./PlayfieldDimens"
import CoreState from "../../core/definitions/CoreState"

interface PlayfieldReducer {

    reduce: <S extends CoreState>(params: { coreState: S, playfieldDimens: PlayfieldDimens }) => PlayfieldReducer.Result

}

namespace PlayfieldReducer {

    export interface Result {
        playfield: Playfield
        linesCleared: number[]
    }

}

export default PlayfieldReducer