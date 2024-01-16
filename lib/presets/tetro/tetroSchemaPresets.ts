import GameSchema from "../../schema/definitions/GameSchema"
import PieceGenerators from "../../schema/featureProviders/pieceGenerators"
import LockdownPresets from "../universal/lockdownSystems"
import TetroPiece from "./TetroPiece"
import PlayfieldReducers from "../../schema/featureProviders/playfieldReducers"
import GhostProviders from "../../schema/featureProviders/ghostProviders"
import RotationSystemPresets from "./tetroRotationSystemPresets"
import tetroPlayfieldSpec from "./tetroPlayfieldSpec"

const pieces = TetroPiece.identifiers.sort()
type SchemaPresets = Record<string, GameSchema>

export default {
    guideline: {
        playfield: tetroPlayfieldSpec,
        pieceGenerator: PieceGenerators.randomBag(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.extendedPlacement,
        rotationSystem: RotationSystemPresets.srs,
        ghostProvider: GhostProviders.classic
    },
    nintendo: {
        playfield: tetroPlayfieldSpec,
        pieceGenerator: PieceGenerators.pureRandom(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: RotationSystemPresets.nrs,
        ghostProvider: GhostProviders.classic
    },
    sega: {
        playfield: tetroPlayfieldSpec,
        pieceGenerator: PieceGenerators.pureRandom(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: RotationSystemPresets.sega,
        ghostProvider: GhostProviders.classic
    }
} satisfies SchemaPresets