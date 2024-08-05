import Orientation from "../../../definitions/Orientation"
import Outcome from "../../../definitions/Outcome"
import type Coordinate from "../../../definitions/Coordinate"
import CoreState from "../../../core/definitions/CoreState"
import Rotation from "../../../definitions/Rotation"
import GameSchema from "../../definitions/GameSchema"
import { willCollide } from "../../../util/stateUtils"
import PieceSpec from "../../definitions/PieceSpec"
import type PieceIdentifier from "../../../definitions/PieceIdentifier";

interface RotationSystem  {
    pieces: Record<PieceIdentifier, PieceSpec>,
    rotate: RotationSystem.RotationBehavior
}

namespace RotationSystem {

    export type Offset = [number, number]

    export type RotationBehavior = (
        params: { rotation: Rotation, state: CoreState, schema: GameSchema }
    ) => Outcome<RotationResult>

    export interface RotationResult {
        offset: Offset
        newOrientation: Orientation,
        newCoordinates: Coordinate[]
    }

    export interface Basis {
        pieces: PieceSpec.Basis[],
        rotate: RotationBehavior
    }

    export interface Validator {
        isValidRotation: (
            state: CoreState,
            coordinates: readonly Coordinate[],
            offset: Offset,
            schema: GameSchema
        ) => boolean
    }

    export namespace Validator {

        export const overlapCollision: Validator = {
            isValidRotation: ({ playfield }: CoreState, coordinates: Readonly<Coordinate[]>, offset: Offset) => {
                return !willCollide(playfield, coordinates, offset[0], offset[1])
            }
        }

    }

}

export default RotationSystem