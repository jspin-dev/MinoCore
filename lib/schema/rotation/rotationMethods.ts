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

    export const basic = (validator: RotationSystem.Validator = RotationSystem.Validator.simpleCollision) => {
        return (({ rotation, state}) => {
            const baseInfo = getBaseRotationInfo(rotation, state as CoreState & GeneratedGrids)
            const shouldRotate = validator.isValid(state, baseInfo.unadjustedCoordinates, [0, 0])
            const result = { offset: [0, 0], ...baseInfo } satisfies RotationSystem.RotateResult
            const returnValue = shouldRotate ? Outcome.Success(result) : Outcome.Failure()
            return returnValue satisfies Outcome<RotationSystem.RotateResult>
        }) satisfies RotationSystem.RotationBehavior
    }

    export const kickTable = (tables: KickTable.FullInfo) => {
        return (({ rotation, state }) => {
            const baseInfo = getBaseRotationInfo(rotation, state as CoreState & GeneratedGrids)
            const activePiece = state.activePiece
            const fullInfo = tables[activePiece.id]
            const offsetList = fullInfo.table[activePiece.orientation][baseInfo.newOrientation]
            const validator = fullInfo.validator ?? RotationSystem.Validator.simpleCollision
            const matchingOffset = offsetList.find(offset => {
                return validator.isValid(state, baseInfo.unadjustedCoordinates, offset)
            })
            const result = { offset: matchingOffset, ...baseInfo }
            const returnValue = matchingOffset != null ? Outcome.Success(result) : Outcome.Failure()
            return returnValue satisfies Outcome<RotationSystem.RotateResult>
        }) satisfies RotationSystem.RotationBehavior
    }

    const getBaseRotationInfo = (
        rotation: Rotation,
        state: CoreState & GeneratedGrids
    ) => {
        const { activePiece, generatedGrids } = state
        const orientationCount = Object.keys(Orientation).length / 2
        const newOrientation: Orientation = (rotation + activePiece.orientation + orientationCount) % orientationCount
        const newMatrix = generatedGrids[activePiece.id][newOrientation].map(it => [...it])
        const unadjustedCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1)
        return { newOrientation, unadjustedCoordinates } satisfies { newOrientation: Orientation, unadjustedCoordinates: Coordinate[] }
    }

}

export default RotationMethods