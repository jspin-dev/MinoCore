import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import CorePreconditions from "../../../utils/CorePreconditions"
import Rotation from "../../../../definitions/Rotation"
import Outcome from "../../../../definitions/Outcome"
import GameEvent from "../../../../definitions/GameEvent"
import RotationSystemBasis from "../../../../schema/rotation/definitions/RotationSystem"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import CoreState from "../../../definitions/CoreState"
import MovementType from "../../../../definitions/MovementType"
import Coordinate from "../../../../definitions/Coordinate"
import { mapOperation, passthroughOperation, sequence, withPreconditions } from "../../../../util/operationUtils"
import { updateActivePlayfield } from "../../../../util/stateUtils"
import { findAvailableDropDistance, findAvailableShiftDistance } from "../../../utils/coreOpStateUtils"
import { addEvent, mapCoreState, mapFromOperations } from "../../../utils/coreOperationUtils"

const rootOperation = (rotation: Rotation) => mapFromOperations(operations => {
    return sequence(rotate(rotation), operations.continueInstantDrop, operations.continueInstantShift)
})

const rotate = (rotation: Rotation) => {
    return mapOperation(({ state }: CoreResult, { operations, schema }: CoreDependencies) => {
        const previousPlayfield = [...state.playfield.map(row => [...row])]
        const rotationResult = schema.rotationSystem.rotate({ rotation, state, schema })
        switch (rotationResult.classifier) {
            case Outcome.Classifier.Failure:
                return passthroughOperation
            case Outcome.Classifier.Success:
                return sequence(
                    applyRotationResult(rotationResult.data),
                    operations.refreshGhost,
                    operations.updateLockStatus(MovementType.Rotate),
                    addEvent(
                        GameEvent.Rotate({
                            rotation,
                            previousPlayfield,
                            playfield: state.playfield,
                            activePiece: state.activePiece
                        })
                    )
                )
        }
    })
}

const applyRotationResult = (rotationResult: RotationSystemBasis.RotationResult) => {
    return mapCoreState(({ activePiece, playfield }: CoreState, { schema }: CoreDependencies) => {
        const { newOrientation, offset, newCoordinates } = rotationResult
        const { location, id, orientation } = activePiece
        if (offset == undefined || newCoordinates == undefined) {
            return {
                activePiece: {
                    ...activePiece,
                    orientation: newOrientation ?? orientation
                }
            }
        }
        const adjustedCoordinates = newCoordinates.map(c => Coordinate.offset(c, offset))
        const newPlayfield = updateActivePlayfield({
            playfield,
            activePieceCoordinates: adjustedCoordinates,
            pieceId: id
        })
        const distanceCalculationInfo = {
            coordinates: adjustedCoordinates,
            playfield: newPlayfield,
            playfieldDimens: schema.playfieldDimens
        }
        const newActivePiece = {
            ...activePiece,
            location: Coordinate.offset(location, offset),
            orientation: newOrientation ?? orientation,
            coordinates: adjustedCoordinates,
            availableDropDistance: findAvailableDropDistance(distanceCalculationInfo),
            availableShiftDistance: {
                [ShiftDirection.Left]: findAvailableShiftDistance(ShiftDirection.Left, distanceCalculationInfo),
                [ShiftDirection.Right]: findAvailableShiftDistance(ShiftDirection.Right, distanceCalculationInfo),
            }
        }
        return { playfield: newPlayfield, activePiece: newActivePiece }
    })
}

export default (rotation: Rotation) => withPreconditions({
    operationName: "rotate",
    operation: rootOperation(rotation),
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})