import GameSchema from "../../schema/definitions/GameSchema"
import PieceGenerators from "../universal/pieceGenerators"
import LockdownPresets from "../universal/lockdownPresets"
import TetroPiece from "./TetroPiece"
import PatternDetectors from "../../schema/featureProviders/patternDetectors"
import nrs from "./rotationSystems/nintendoRS"
import segaRS from "./rotationSystems/segaRS"
import superRS from "./rotationSystems/superRS"

let standardPlayfieldSpec = { columns: 10, rows: 40, ceiling: 20 }
let pieces = TetroPiece.identifiers.sort()

interface SchemaPresets {
    guideline: GameSchema,
    nintendo: GameSchema,
    sega: GameSchema
}

let schemas: SchemaPresets = {
    guideline: {
        playfield: standardPlayfieldSpec,
        pieceGenerator: PieceGenerators.randomBag(15, pieces),
        patternDetector: PatternDetectors.line,
        lockProvider: LockdownPresets.extendedPlacement,
        rotationSystem: superRS
    },
    nintendo: {
        playfield: standardPlayfieldSpec,
        pieceGenerator: PieceGenerators.random(5, pieces),
        patternDetector: PatternDetectors.line,
        lockProvider: LockdownPresets.classic,
        rotationSystem: nrs
    },
    sega: {
        playfield: standardPlayfieldSpec,
        pieceGenerator: PieceGenerators.random(5, pieces),
        patternDetector: PatternDetectors.line,
        lockProvider: LockdownPresets.classic,
        rotationSystem: segaRS
    }
}

export default schemas