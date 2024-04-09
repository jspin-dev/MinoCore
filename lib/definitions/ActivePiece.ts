import Coordinate from "./Coordinate"
import type PieceIdentifier from "./PieceIdentifier"
import type Orientation from "./Orientation"
import ShiftPair from "./ShiftPair"
import { arraysEqual } from "../util/sharedUtils"

interface ActivePiece {
    id: PieceIdentifier
    location: Coordinate
    coordinates: Coordinate[]
    ghostCoordinates: Coordinate[]
    orientation: Orientation,
    maxDepth: number,
    availableDropDistance: number
    availableShiftDistance: ShiftPair<number>
}

namespace ActivePiece {

    export interface Diff {
        partial?: Partial<ActivePiece>,
        availableShiftDistance?: Partial<ShiftPair<number>>
    }

}

// Convenience
namespace ActivePiece {

    export const equal = (before: ActivePiece, after: ActivePiece) => {
        return diff(before, after) != null
    }

    export const diff = (before: ActivePiece, after: ActivePiece) => {
        let partial: Partial<ActivePiece> = {}
        if (before.id != after.id) {
            partial.id = after.id
        }
        if (!Coordinate.equal(before.location, after.location)) {
            partial.location = after.location
        }
        if (before.coordinates.length != after.coordinates.length
            && before.coordinates.every((c, i) => Coordinate.equal(c, after.coordinates[i]))) {
            partial.coordinates = after.coordinates
        }
        if (!arraysEqual(before.ghostCoordinates, after.ghostCoordinates, Coordinate.equal)) {
            partial.ghostCoordinates = after.ghostCoordinates
        }
        if (before.orientation != after.orientation) {
            partial.orientation = after.orientation
        }
        if (before.maxDepth != after.maxDepth) {
            partial.maxDepth = after.maxDepth
        }
        if (before.availableDropDistance != after.availableDropDistance) {
            partial.availableDropDistance = after.availableDropDistance
        }

        let diff: Diff = { partial }
        let availableShiftDistanceDiff = ShiftPair.diff(before.availableShiftDistance, after.availableShiftDistance)
        if (availableShiftDistanceDiff) {
            diff.availableShiftDistance = availableShiftDistanceDiff
        }
        const returnValue = Object.keys(diff).length > 0 ? diff : null
        return returnValue satisfies Diff
    }

}

export default ActivePiece