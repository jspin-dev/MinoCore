import GameSchema from "../../schema/definitions/GameSchema"
import PieceGenerators from "../../schema/featureProviders/pieceGenerators"
import LockdownPresets from "../universal/lockdownPresets"
import TetroPiece from "./TetroPiece"
import PlayfieldReducers from "../../schema/featureProviders/playfieldReducers"
import nrs from "./rotationSystems/nintendoRS"
import segaRS from "./rotationSystems/segaRS"
import superRS from "./rotationSystems/superRS"
import GhostProviders from "../../schema/featureProviders/ghostProviders"

export const defaultPlayfieldSpec = { columns: 10, rows: 40, ceiling: 20 }
export const pieces = TetroPiece.identifiers.sort()

interface SchemaPresets {
    guideline: GameSchema,
    nintendo: GameSchema,
    sega: GameSchema
}

export default {
    guideline: {
        playfield: defaultPlayfieldSpec,
        pieceGenerator: PieceGenerators.randomBag(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.extendedPlacement,
        rotationSystem: superRS,
        ghostProvider: GhostProviders.classic
    },
    nintendo: {
        playfield: defaultPlayfieldSpec,
        pieceGenerator: PieceGenerators.pureRandom(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: nrs,
        ghostProvider: GhostProviders.classic
    },
    sega: {
        playfield: defaultPlayfieldSpec,
        pieceGenerator: PieceGenerators.pureRandom(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: segaRS,
        ghostProvider: GhostProviders.classic
    }
} satisfies SchemaPresets