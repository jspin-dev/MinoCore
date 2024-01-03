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

    export let initial: ActivePiece = {
        id: null,
        location: null,
        coordinates: [],
        ghostCoordinates: [],
        orientation: null,
        maxDepth: 0,
        availableDropDistance: null,
        availableShiftDistance: null
    }

    export interface Diff {
        id?: PieceIdentifier,
        location?: Coordinate
        coordinates?: Coordinate[]
        ghostCoordinates?: Coordinate[]
        orientation?: Orientation,
        maxDepth?: number,
        availableDropDistance?: number
        availableShiftDistance?: ShiftPair.Diff<number>
    }

}

// Convenience
namespace ActivePiece {

    export let equal = (before: ActivePiece, after: ActivePiece): boolean => {
        return diff(before, after) != null
    }

    export let diff = (before: ActivePiece, after: ActivePiece): Diff => {
        let diff: Diff = {}
        if (before.id != after.id) {
            diff.id = after.id
        }
        if (!Coordinate.equal(before.location, after.location)) {
            diff.location = after.location
        }
        if (before.coordinates.length != after.coordinates.length
            && before.coordinates.every((c, i) => Coordinate.equal(c, after.coordinates[i]))) {
            diff.coordinates = after.coordinates
        }
        if (!arraysEqual(before.ghostCoordinates, after.ghostCoordinates, Coordinate.equal)) {
            diff.ghostCoordinates = after.ghostCoordinates
        }
        if (before.orientation != after.orientation) {
            diff.orientation = after.orientation
        }
        if (before.maxDepth != after.maxDepth) {
            diff.maxDepth = after.maxDepth
        }
        if (before.availableDropDistance != after.availableDropDistance) {
            diff.availableDropDistance = after.availableDropDistance
        }
        let availableShiftDistanceDiff = ShiftPair.diff(before.availableShiftDistance, after.availableShiftDistance)
        if (availableShiftDistanceDiff) {
            diff.availableShiftDistance = availableShiftDistanceDiff
        }
        return Object.keys(diff).length > 0 ? diff : null
    }

}

export default ActivePiece