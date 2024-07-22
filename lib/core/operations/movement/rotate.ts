import CoreResult from "../../definitions/CoreResult"
import CoreDependencies from "../../definitions/CoreDependencies"
import CorePreconditions from "../../utils/CorePreconditions"
import Rotation from "../../../definitions/Rotation"
import Outcome from "../../../definitions/Outcome"
import GameEvent from "../../../definitions/GameEvent"
import RotationSystem from "../../../schema/rotation/definitions/RotationSystem"
import ShiftDirection from "../../../definitions/ShiftDirection"
import CoreState from "../../definitions/CoreState"
import MovementType from "../../../definitions/MovementType"

import { mapOperation, passthroughOperation, sequence, withCondition, withPreconditions } from "../../../util/operationUtils"
import { updateActivePlayfield } from "../../../util/stateUtils"
import { findAvailableDropDistance, findAvailableShiftDistance } from "../../utils/coreOpStateUtils"
import { addEvent, mapCoreState, mapFromOperations } from "../../utils/coreOperationUtils"

const rootOperation = (rotation: Rotation) => mapFromOperations(operations => {
    return sequence(rotate(rotation), operations.continueInstantDrop, operations.continueInstantShift)
})

const rotate = (rotation: Rotation) => {
    return mapOperation(({ state }: CoreResult, { operations, schema }: CoreDependencies) => {
        const previousPlayfield = [...state.playfield.map(row => [...row])]
        const rotationResult = schema.rotationSystem.rotate({ rotation, state })
        switch (rotationResult.classifier) {
            case Outcome.Classifier.Failure:
                return passthroughOperation
            case Outcome.Classifier.Success:
                return sequence(
                    applyRotationResult(rotationResult.data),
                    updateDistanceCalc, // Order matters - This relies on new state from applyRotationResult(...)
                    withCondition(operations.refreshGhost, rotationResult.data.unadjustedCoordinates != null),
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

const applyRotationResult = (rotationResult: RotationSystem.RotateResult) => {
    return mapCoreState(({ activePiece, playfield }: CoreState) => {
        const { newOrientation, offset, unadjustedCoordinates } = rotationResult
        const { location, id, orientation } = activePiece
        if (offset == undefined || unadjustedCoordinates == undefined) {
            return {
                activePiece: {
                    ...activePiece,
                    orientation: newOrientation == undefined ? orientation : newOrientation
                }
            }
        }
        const newActivePieceCoordinates = unadjustedCoordinates.map(c => {
            return { x: c.x + offset[0], y: c.y + offset[1] }
        })
        const newPlayfield = updateActivePlayfield({
            playfield,
            activePieceCoordinates: newActivePieceCoordinates,
            pieceId: id
        })
        const newActivePiece = {
            ...activePiece,
            location: {
                x: location.x + offset[0],
                y: location.y + offset[1]
            },
            orientation: newOrientation == undefined ? orientation : newOrientation,
            coordinates: newActivePieceCoordinates
        }
        return { playfield: newPlayfield, activePiece: newActivePiece }
    })
}

const updateDistanceCalc = mapCoreState((state: CoreState, { schema }: CoreDependencies) => {
    const { activePiece, playfield } = state
    const distanceCalculationInfo = { coordinates: activePiece.coordinates, playfield, playfieldDimens: schema.playfield }
    return {
        activePiece: {
            ...activePiece,
            availableDropDistance: findAvailableDropDistance(distanceCalculationInfo),
            availableShiftDistance: {
                [ShiftDirection.Left]: findAvailableShiftDistance(ShiftDirection.Left, distanceCalculationInfo),
                [ShiftDirection.Right]: findAvailableShiftDistance(ShiftDirection.Right, distanceCalculationInfo),
            }
        }
    }
})

export default (rotation: Rotation) => withPreconditions({
    operationName: "rotate",
    operation: rootOperation(rotation),
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})