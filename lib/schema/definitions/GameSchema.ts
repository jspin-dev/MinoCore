import type RotationSystem from "../rotation/definitions/RotationSystem"
import type PlayfieldDimens from "./PlayfieldDimens"
import type PieceGenerator from "./PieceGenerator"
import type PlayfieldReducer from "./PlayfieldReducer"
import type LockdownSystem from "./LockdownSystem"
import type GhostProvider from "./GhostProvider"
import GameOverDetector from "./GameOverDetector"

interface GameSchema {
    playfieldDimens: PlayfieldDimens
    pieceGenerator: PieceGenerator
    playfieldReducer: PlayfieldReducer
    lockdownSystem: LockdownSystem
    rotationSystem: RotationSystem
    ghostProvider: GhostProvider
    gameOverDetector: GameOverDetector
}

namespace GameSchema {

    export interface Basis {
        playfieldDimens: PlayfieldDimens
        pieceGenerator: PieceGenerator
        playfieldReducer: PlayfieldReducer
        lockdownSystem: LockdownSystem
        rotationSystem: RotationSystem.Basis
        ghostProvider: GhostProvider
        gameOverDetector: GameOverDetector
    }

}

export default GameSchema