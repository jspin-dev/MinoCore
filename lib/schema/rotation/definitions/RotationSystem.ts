import Orientation from "../../../definitions/Orientation"
import type PieceIdentifier from "../../../definitions/PieceIdentifier"
import Outcome from "../../../definitions/Outcome"
import type Coordinate from "../../../definitions/Coordinate"
import CoreState from "../../../core/definitions/CoreState"
import CoreDependencies from "../../../core/definitions/CoreDependencies"
import CoreOperationResult from "../../../core/definitions/CoreOperationResult"
import Rotation from "../../../definitions/Rotation"
import PieceSpawnInfo from "../../definitions/PieceSpawnInfo"
import { willCollide } from "../../../util/stateUtils"
import Operation from "../../../definitions/Operation";

interface RotationSystem {
    rotate: RotationSystem.RotationBehavior,
    initialize: Operation<CoreOperationResult<CoreState>, CoreDependencies>,
    getSpawnInfo: RotationSystem.SpawnInfoProvider,
}

namespace RotationSystem {

    export type Offset = [number, number]

    export interface RotateResult {
        offset: Offset
        newOrientation: Orientation,
        unadjustedCoordinates: Coordinate[]
    }

}

namespace RotationSystem {

    export type RotationBehavior = (params: { rotation: Rotation, state: CoreState }) => Outcome<RotateResult>

    export type SpawnInfoProvider = (params: { pieceId: PieceIdentifier, state: CoreState }) => PieceSpawnInfo

}

namespace RotationSystem {

    export interface Validator {
        isValid: (state: CoreState, coordinates: readonly Coordinate[], offset: Offset) => boolean
    }

    export namespace Validator {
        export const simpleCollision: RotationSystem.Validator = {
            isValid: ({ playfield }: CoreState, coordinates: Readonly<Coordinate[]>, offset: Offset) => {
                return !willCollide(playfield, coordinates, offset[0], offset[1])
            }
        }

    }

}

export default RotationSystem