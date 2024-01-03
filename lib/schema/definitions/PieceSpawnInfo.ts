import Orientation from "../../definitions/Orientation"
import Coordinate from "../../definitions/Coordinate"
import BinaryGrid from "../../definitions/BinaryGrid"

export default interface PieceSpawnInfo {
    grid: BinaryGrid,
    orientation: Orientation,
    location: Coordinate
}