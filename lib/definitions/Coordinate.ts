import coordinate from "./Coordinate";
import RotationSystemBasis from "../schema/rotation/definitions/RotationSystem";

interface Coordinate {
    x: number
    y: number
}

namespace Coordinate {

    export const equals = (coordinate1: Coordinate, coordinate2: Coordinate) => {
        if (!coordinate1 && !coordinate2) {
            return true
        }
        if ((!coordinate1 || !coordinate2)) {
            return false
        }
        return coordinate1.x == coordinate2.x && coordinate1.y == coordinate2.y
    }

    export const includes = (coordinates: Coordinate[], refCoordinate: Coordinate) => {
        return coordinates.some(c => equals(refCoordinate, c))
    }

    export const offset = (coordinate: Coordinate, offset: [number, number]) => {
        return {
            x: coordinate.x + offset[0],
            y: coordinate.y + offset[1]
        }
    }

}

export default Coordinate