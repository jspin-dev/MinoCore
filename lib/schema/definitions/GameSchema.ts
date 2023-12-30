import type RotationSystem from "../rotation/definitions/RotationSystem"
import type PieceGenerator from "./PieceGenerator"
import LockdownProvider from "./LockdownProvider"
import PlayfieldSpec from "./PlayfieldSpec"

export default interface GameSchema {
    playfield: PlayfieldSpec
    pieceGenerator: PieceGenerator
    lockProvider: LockdownProvider
    rotationSystem: RotationSystem
}