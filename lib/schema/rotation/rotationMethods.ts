import Orientation from "../../definitions/Orientation"
import RotationSystem from "./definitions/RotationSystem"
import Coordinate from "../../definitions/Coordinate"
import Outcome from "../../definitions/Outcome"
import KickTable from "./definitions/KickTable"
import Rotation from "../../definitions/Rotation"
import CoreState from "../../core/definitions/CoreState"
import GeneratedGrids from "./definitions/GeneratedGrids"
import { gridToList } from "../../util/sharedUtils"

namespace RotationMethods {

    export let basic = (
        validator: RotationSystem.Validator = RotationSystem.Validator.simpleCollision
    ): RotationSystem.RotationBehavior => {
        return ({ rotation, state}): Outcome<RotationSystem.RotateResult> => {
            let baseInfo = getBaseRotationInfo(rotation, state as CoreState & GeneratedGrids)
            let shouldRotate = validator.isValid(state, baseInfo.unadjustedCoordinates, [0, 0])
            let result: RotationSystem.RotateResult = { offset: [0, 0], ...baseInfo }
            return shouldRotate ? Outcome.Success(result) : Outcome.Failure()
        }
    }

    export let kickTable = (tables: KickTable.FullInfo): RotationSystem.RotationBehavior => {
        return ({ rotation, state }): Outcome<RotationSystem.RotateResult> => {
            let baseInfo = getBaseRotationInfo(rotation, state as CoreState & GeneratedGrids)
            let activePiece = state.activePiece
            let fullInfo = tables[activePiece.id]
            let offsetList = fullInfo.table[activePiece.orientation][baseInfo.newOrientation]
            let validator = fullInfo.validator ?? RotationSystem.Validator.simpleCollision
            let matchingOffset = offsetList.find(offset => {
                return validator.isValid(state, baseInfo.unadjustedCoordinates, offset)
            })
            let result: RotationSystem.RotateResult = { offset: matchingOffset, ...baseInfo }
            return matchingOffset != null ? Outcome.Success(result) : Outcome.Failure()
        }
    }

    let getBaseRotationInfo = (
        rotation: Rotation,
        state: CoreState & GeneratedGrids
    ): { newOrientation: Orientation, unadjustedCoordinates: Coordinate[] } => {
        let { activePiece, generatedGrids } = state
        let orientationCount = Object.keys(Orientation).length / 2
        let newOrientation: Orientation = (rotation + activePiece.orientation + orientationCount) % orientationCount
        let newMatrix = generatedGrids[activePiece.id][newOrientation].map(it => [...it])
        let unadjustedCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1)
        return { newOrientation, unadjustedCoordinates }
    }

}

export default RotationMethods