import type RotationSystem from "../rotation/definitions/RotationSystem"
import type PieceGenerator from "./PieceGenerator"
import LockdownProvider from "./LockdownProvider"
import PlayfieldSpec from "./PlayfieldSpec"
import PatternDetector from "./PatternDetector"

export default interface GameSchema {
    playfield: PlayfieldSpec
    pieceGenerator: PieceGenerator
    patternDetector: PatternDetector,
    lockProvider: LockdownProvider
    rotationSystem: RotationSystem
}