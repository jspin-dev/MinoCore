import Orientation from "../../definitions/Orientation"
import RotationSystem from "../definitions/RotationSystem"
import Coordinate from "../../definitions/Coordinate"
import Outcome from "../../definitions/Outcome"
import KickTable from "../definitions/KickTable"
import RotationValidatorPresets from "./rotationValidators"

namespace RotationProviderPresets {

    export let basic = (
        validator: RotationSystem.Validator = RotationValidatorPresets.simpleCollision
    ): RotationSystem.FeatureProvider => {
        return {
            rotate: (
                stateReference: RotationSystem.StateReference,
                _orientation: Orientation, 
                unadjustedCoordinates: Coordinate[]
            ): Outcome<RotationSystem.Offset> => {
                let shouldRotate = validator.isValid(stateReference, unadjustedCoordinates, [0, 0]);
                return shouldRotate ? Outcome.Success([0, 0]) : Outcome.Failure()
            }
        } 
    }

    export let kickTable = (
        tables: KickTable.Map, 
        validator: RotationSystem.Validator = RotationValidatorPresets.simpleCollision
    ): RotationSystem.FeatureProvider => {
        return {
            rotate: (
                stateReference: RotationSystem.StateReference,
                orientation: Orientation, 
                unadjustedCoordinates: Coordinate[]
            ): Outcome<RotationSystem.Offset> => {
                let activePiece = stateReference.activePiece
                let offsetList = tables[activePiece.id][activePiece.orientation][orientation]
                let matchingOffset = offsetList.find(offset => {
                    return validator.isValid(stateReference, unadjustedCoordinates, offset)
                })
                return matchingOffset != null ? Outcome.Success(matchingOffset) : Outcome.Failure()
            }
        }
    }

}

export default RotationProviderPresets