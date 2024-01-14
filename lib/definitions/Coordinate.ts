interface Coordinate {
    x: number
    y: number
}

namespace Coordinate {

    export const equal = (coordinate1: Coordinate, coordinate2: Coordinate) => {
        if (!coordinate1 && !coordinate2) {
            return true
        }
        if ((!coordinate1 || !coordinate2)) {
            return false
        }
        return coordinate1.x == coordinate2.x && coordinate1.y == coordinate2.y
    }

}

export default Coordinate