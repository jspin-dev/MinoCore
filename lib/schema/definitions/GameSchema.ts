import type RotationSystem from "../rotation/definitions/RotationSystem"
import type PieceGenerator from "./PieceGenerator"
import LockdownSystem from "./LockdownSystem"
import PlayfieldSpec from "./PlayfieldSpec"
import PlayfieldReducer from "./PlayfieldReducer"
import GhostProvider from "./GhostProvider"

export default interface GameSchema {
    playfield: PlayfieldSpec
    pieceGenerator: PieceGenerator
    playfieldReducer: PlayfieldReducer
    lockdownSystem: LockdownSystem
    rotationSystem: RotationSystem
    ghostProvider: GhostProvider
}