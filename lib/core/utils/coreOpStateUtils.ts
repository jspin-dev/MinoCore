import type Coordinate from "../../definitions/Coordinate"
import type ShiftDirection from "../../definitions/ShiftDirection"
import type Playfield from "../../definitions/Playfield"
import { willCollide } from "../../util/stateUtils"
import PlayfieldSpec from "../../schema/definitions/PlayfieldSpec"

export interface DistanceCalculationInfo {
    coordinates: Coordinate[],
    playfield: Playfield,
    playfieldSpec: PlayfieldSpec
}

export const findAvailableDropDistance = (info: DistanceCalculationInfo) => {
    const { coordinates, playfield, playfieldSpec } = info
    if (coordinates.length == 0) { return 0 }
    const dropPositions = Array.from({length: playfieldSpec.rows}, (_, i) => i + 1)
    const collisionY = dropPositions.find(n => willCollide(playfield, coordinates, 0, n))
    return Math.abs(collisionY - 1) satisfies number
}

export const findAvailableShiftDistance = (direction: ShiftDirection, info: DistanceCalculationInfo) => {
    const { coordinates, playfield, playfieldSpec } = info
    if (coordinates.length == 0) { return 0 }
    const shiftPositions = Array.from({ length: playfieldSpec.columns }, (_, i) => i + 1)
    const collisionX = shiftPositions.find(n => willCollide(playfield, coordinates, n * direction, 0))
    return Math.abs(direction * (collisionX - 1)) satisfies number
}
