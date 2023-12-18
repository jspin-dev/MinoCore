import Coordinate from "../../definitions/Coordinate";
import CoreDependencies from "../../coreOperations/definitions/CoreDependencies";
import CoreState from "../../coreOperations/definitions/CoreState";
import Orientation from "../../definitions/Orientation";
import PieceIdentifier from "../../definitions/PieceIdentifier";
import Rotation from "../../coreOperations/definitions/Rotation";

interface RotationSystem {
    offsets: { [id: PieceIdentifier]: RotationSystem.BoundingBoxOffsets }
    featureProvider: RotationSystem.FeatureProvider
}

namespace RotationSystem {

    export interface FeatureProvider {
        rotate: (n: Rotation, state: CoreState, dependencies: CoreDependencies) => RotationSystem.Result
    }
    
    export interface Result {
        newOrientation: Orientation
        offset?: Offset
        unadjustedCoordinates?: Coordinate[]
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

    export type Offset = [number, number]

}

export default RotationSystem;