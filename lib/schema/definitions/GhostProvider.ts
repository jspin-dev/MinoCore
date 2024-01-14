import Coordinate from "../../definitions/Coordinate"
import CoreOperationResult from "../../core/definitions/CoreOperationResult"
import CoreState from "../../core/definitions/CoreState"

interface GhostProvider {
    calculateCoordinates: <S extends CoreState>(result: CoreOperationResult<S>) => Coordinate[]
}

export default GhostProvider