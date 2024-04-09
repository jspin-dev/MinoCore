import GameSchema from "../../schema/definitions/GameSchema"
import PieceGenerators from "../../schema/featureProviders/pieceGenerators"
import LockdownPresets from "../universal/lockdownSystems"
import TetroPiece from "./TetroPiece"
import PlayfieldReducers from "../../schema/featureProviders/playfieldReducers"
import GameOverProviders from "../../schema/featureProviders/gameOverDetectors"
import GhostProviders from "../../schema/featureProviders/ghostProviders"
import RotationSystemPresets from "./tetroRotationSystemPresets"

const pieces = TetroPiece.identifiers.sort()

// type defaultedParams = "playfield" | "playfieldReducer" | "ghostProvider" | "gameOverDetector"
// type SchemaDefaults = Pick<GameSchema, defaultedParams>
// type PartialGameSchema = Partial<GameSchema> & SchemaDefaults

export const defaults = {
    playfield: { columns: 10, rows: 40 },
    playfieldReducer: PlayfieldReducers.standardCollapse,
    ghostProvider: GhostProviders.classic,
    gameOverDetector: GameOverProviders.guideline({ ceiling: 20 })
}

export default {
    guideline: {
        ...defaults,
        pieceGenerator: PieceGenerators.randomBag(5, pieces),
        lockdownSystem: LockdownPresets.extendedPlacement,
        rotationSystem: RotationSystemPresets.srs
    },
    nintendo: {
        ...defaults,
        pieceGenerator: PieceGenerators.pureRandom(5, pieces),
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: RotationSystemPresets.nrs
    },
    sega: {
        ...defaults,
        pieceGenerator: PieceGenerators.pureRandom(5, pieces),
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: RotationSystemPresets.sega
    }
} satisfies Record<string, GameSchema>