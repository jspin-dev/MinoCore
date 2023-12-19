import Orientation from "../../definitions/Orientation";
import PieceIdentifier from "../../definitions/PieceIdentifier";
import Outcome from "../../definitions/Outcome";
import Coordinate from "../../definitions/Coordinate";
import Cell from "../../definitions/Cell";
import Grid from "../../definitions/Grid";
import BinaryGrid from "../../definitions/BinaryGrid";
import ActivePiece from "../../definitions/ActivePiece";

interface RotationSystem {
    offsets: { [id: PieceIdentifier]: RotationSystem.BoundingBoxOffsets }
    featureProvider: RotationSystem.FeatureProvider
}

namespace RotationSystem {

    export type Offset = [number, number]

    export interface GeneratedGrids {
        [Orientation.North]: BinaryGrid
        [Orientation.East]: BinaryGrid
        [Orientation.South]: BinaryGrid
        [Orientation.West]: BinaryGrid
    }

    export interface BoundingBoxOffsets {
        [Orientation.North]: Offset
        [Orientation.East]: Offset
        [Orientation.South]: Offset
        [Orientation.West]: Offset
    }

    export namespace BoundingBoxOffsets {

        export let None: BoundingBoxOffsets = {
            [Orientation.North]: [0, 0],
            [Orientation.East]: [0, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [0, 0]
        }

    }

}

// Feature provider types
namespace RotationSystem {

    export interface FeatureProvider {
        rotate: (
            stateReference: StateReference,
            orientation: Orientation, 
            unadjustedCoordinates: Coordinate[]
        ) => Outcome<Offset>
    }

    export interface Validator {
        isValid: (
            stateReference: StateReference,
            coordinates: readonly Coordinate[], 
            offset: RotationSystem.Offset
        ) => boolean
    }

    export interface StateReference {
        playfield: Grid<Cell>
        activePiece: ActivePiece,
        generatedGrids: { [id: PieceIdentifier]: RotationSystem.GeneratedGrids }
    }

}

export default RotationSystem