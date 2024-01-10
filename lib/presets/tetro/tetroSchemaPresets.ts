import GameSchema from "../../schema/definitions/GameSchema"
import PieceGenerators from "../universal/pieceGenerators"
import LockdownPresets from "../universal/lockdownPresets"
import TetroPiece from "./TetroPiece"
import PlayfieldReducers from "../../schema/featureProviders/playfieldReducers"
import nrs from "./rotationSystems/nintendoRS"
import segaRS from "./rotationSystems/segaRS"
import superRS from "./rotationSystems/superRS"

let defaultPlayfieldSpec = { columns: 10, rows: 40, ceiling: 20 }
let pieces = TetroPiece.identifiers.sort()

interface SchemaPresets {
    guideline: GameSchema,
    nintendo: GameSchema,
    sega: GameSchema
}

let schemas: SchemaPresets = {
    guideline: {
        playfield: defaultPlayfieldSpec,
        pieceGenerator: PieceGenerators.randomBag(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.extendedPlacement,
        rotationSystem: superRS
    },
    nintendo: {
        playfield: defaultPlayfieldSpec,
        pieceGenerator: PieceGenerators.random(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: nrs
    },
    sega: {
        playfield: defaultPlayfieldSpec,
        pieceGenerator: PieceGenerators.random(5, pieces),
        playfieldReducer: PlayfieldReducers.standardCollapse,
        lockdownSystem: LockdownPresets.classic,
        rotationSystem: segaRS
    }
}

export default schemas