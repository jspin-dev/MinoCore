import type RotationSystem from "../rotation/definitions/RotationSystem"
import type PieceGenerator from "./PieceGenerator"
import type LockdownSystem from "./LockdownSystem"
import type PlayfieldDimens from "./PlayfieldDimens"
import type PlayfieldReducer from "./PlayfieldReducer"
import type GhostProvider from "./GhostProvider"
import GameOverDetector from "./GameOverDetector"

export default interface GameSchema {
    playfield: PlayfieldDimens
    pieceGenerator: PieceGenerator
    playfieldReducer: PlayfieldReducer
    lockdownSystem: LockdownSystem
    rotationSystem: RotationSystem
    ghostProvider: GhostProvider
    gameOverDetector: GameOverDetector
}