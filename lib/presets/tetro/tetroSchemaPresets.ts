import PieceGenerators from "../../schema/featurePresets/pieceGenerators"
import LockdownPresets from "../universal/lockdownSystems"
import TetroPiece from "./TetroPiece"
import PlayfieldReducers from "../../schema/featurePresets/playfieldReducers"
import GameOverProviders from "../../schema/featurePresets/gameOverDetectors"
import GameSchema from "../../schema/definitions/GameSchema"
import GhostProviders from "../../schema/featurePresets/ghostProviders"
import RotationSystemPresets from "./tetroRotationSystems"

const pieces = TetroPiece.identifiers.sort()

const defaults = {
    playfieldDimens: { columns: 10, rows: 40 },
    playfieldReducer: PlayfieldReducers.standardLineClear,
    ghostProvider: GhostProviders.hardDrop,
    gameOverDetector: GameOverProviders.guideline({ ceiling: 20 })
}

// noinspection JSUnusedGlobalSymbols
export default {
    guideline: {
        ...defaults,
        pieceGenerator: PieceGenerators.randomBag(5, pieces),
        lockdownSystem: LockdownPresets.extendedPlacement,
        rotationSystem: RotationSystemPresets.srs
    },
    nintendo: {
        ...defaults,
        pieceGenerator: PieceGenerators.pureRandom(1, pieces),
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: RotationSystemPresets.nrs
    },
    sega: {
        ...defaults,
        pieceGenerator: PieceGenerators.pureRandom(5, pieces),
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: RotationSystemPresets.sega
    }
} satisfies Record<string, GameSchema.Basis>