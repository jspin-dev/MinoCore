import Orientation from "../../definitions/Orientation"
import RotationSystemBasis from "./definitions/RotationSystem"
import Outcome from "../../definitions/Outcome"
import KickTable from "./definitions/KickTable"
import Rotation from "../../definitions/Rotation"
import ActivePiece from "../../definitions/ActivePiece"
import type BinaryGrid from "../../definitions/BinaryGrid"
import { gridToList } from "../../util/sharedUtils"

namespace RotationMethods {

    export const basic = (validator: RotationSystemBasis.Validator = RotationSystemBasis.Validator.overlapCollision) => {
        return (({ rotation, state, schema }) => {
            const grids = schema.rotationSystem.pieces[state.activePiece.id].grids
            const baseInfo = getBaseRotationInfo(rotation, state.activePiece, grids)
            const shouldRotate = validator.isValidRotation(state, baseInfo.newCoordinates, [0, 0], schema)
            const result = { offset: [0, 0], ...baseInfo } satisfies RotationSystemBasis.RotationResult
            const returnValue = shouldRotate ? Outcome.Success(result) : Outcome.Failure()
            return returnValue satisfies Outcome<RotationSystemBasis.RotationResult>
        }) satisfies RotationSystemBasis.RotationBehavior
    }

    export const kickTable = (tables: KickTable.FullInfo) => {
        return (({ rotation, state, schema }) => {
            const grids = schema.rotationSystem.pieces[state.activePiece.id].grids
            const baseInfo = getBaseRotationInfo(rotation, state.activePiece, grids)
            const activePiece = state.activePiece
            const fullInfo = tables[activePiece.id]
            const offsetList = fullInfo.table[activePiece.orientation][baseInfo.newOrientation]
            const validator = fullInfo.validator ?? RotationSystemBasis.Validator.overlapCollision
            const matchingOffset = offsetList.find(offset => {
                return validator.isValidRotation(state, baseInfo.newCoordinates, offset, schema)
            })
            const result = { offset: matchingOffset, ...baseInfo }
            const returnValue = matchingOffset != null ? Outcome.Success(result) : Outcome.Failure()
            return returnValue satisfies Outcome<RotationSystemBasis.RotationResult>
        }) satisfies RotationSystemBasis.RotationBehavior
    }

    const getBaseRotationInfo = (
        rotation: Rotation,
        activePiece: ActivePiece,
        grids: Record<Orientation, BinaryGrid>
    ) => {
        const orientationCount = Object.keys(Orientation).length / 2
        const newOrientation: Orientation = (rotation + activePiece.orientation + orientationCount) % orientationCount
        const newMatrix = grids[newOrientation].map(it => [...it])
        const newCoordinates = gridToList(newMatrix, activePiece.location.x, activePiece.location.y, 1)
        return { newOrientation, newCoordinates }
    }

}

export default RotationMethods