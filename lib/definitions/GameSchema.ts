import BinaryGrid from "./BinaryGrid"
import Coordinate from "./Coordinate"
import CoreState from "./CoreState"
import Orientation from "./Orientation"
import PieceIdentifier from "./PieceIdentifier"

interface GameSchema {
    playfield: GameSchema.PlayfieldSpec
    pieces: { [id: PieceIdentifier]: GameSchema.PieceDefinition }
}

namespace GameSchema {

    export interface PlayfieldSpec {
        rows: number
        columns: number
        ceiling: number
    }

    export interface RotationValidator {
        isValid: (
            state: CoreState,
            gameSchema: GameSchema,
            coordinates: readonly Coordinate[], 
            offset: GameSchema.Offset
        ) => boolean
    }

    export interface PieceDefinition {
        id: PieceIdentifier
        shape: BinaryGrid
        startLocation: Coordinate
        spawnOrientation: Orientation
        rotationValidator: RotationValidator
        offsets: PureOrientationOffsets
        kickTable: KickTable
    }

    export namespace PieceDefinition {

        export let build = (buildable: Buildable, defaults: Defaults): PieceDefinition => {
            return {
                id: buildable.id,
                shape: buildable.shape,
                startLocation: buildable.startLocation ?? defaults.startLocation,
                spawnOrientation: buildable.spawnOrientation ?? defaults.spawnOrientation,
                rotationValidator: buildable.rotationValidator ?? defaults.rotationValidator,
                offsets: buildable.offsets ?? defaults.offsets,
                kickTable: buildable.kickTable ?? defaults.kickTable
            }
        }

        export interface Buildable {
            id: PieceIdentifier
            shape: BinaryGrid
            startLocation?: Coordinate
            spawnOrientation?: Orientation
            rotationValidator?: RotationValidator
            offsets?: PureOrientationOffsets
            kickTable?: KickTable
        }

        export interface Defaults {
            startLocation: Coordinate
            spawnOrientation: Orientation
            rotationValidator: RotationValidator
            offsets: PureOrientationOffsets
            kickTable: KickTable
        }

    }
    
    export type Offset = [number, number]

    export interface PureOrientationOffsets {
        [Orientation.North]: Offset
        [Orientation.East]: Offset
        [Orientation.South]: Offset
        [Orientation.West]: Offset
    }

    export interface KickTable { 
        [Orientation.North]: KickTable.SubTable,
        [Orientation.East]: KickTable.SubTable,
        [Orientation.South]: KickTable.SubTable,
        [Orientation.West]: KickTable.SubTable 
    }

    export namespace KickTable {

        export interface SubTable {
            [Orientation.North]: Offset[]
            [Orientation.East]: Offset[]
            [Orientation.South]: Offset[]
            [Orientation.West]: Offset[]
        }
    
    }

    export interface KickInfo {
        newOrientation: Orientation
        matchingOffset?: GameSchema.Offset
        unadjustedCoordinates?: Coordinate[]
    }

}

export default GameSchema;