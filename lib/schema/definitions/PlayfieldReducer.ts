import Playfield from "../../definitions/Playfield"
import ActivePiece from "../../definitions/ActivePiece"
import GameSchema from "./GameSchema";

interface PlayfieldReducer {

    reduce: (params: { playfield: Playfield, activePiece: ActivePiece, schema: GameSchema }) => PlayfieldReducer.Result

}

namespace PlayfieldReducer {

    export interface Result {
        playfield: Playfield
        linesCleared: number[]
    }

}

export default PlayfieldReducer