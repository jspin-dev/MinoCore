import MovementType from "../../../../definitions/MovementType"
import Operation from "../../../definitions/CoreOperation"
import GameEvent from "../../../../definitions/GameEvent"
import Rotation from "../../../../definitions/Rotation"
import Cell from "../../../../definitions/Cell"
import CoreDependencies from "../../../definitions/CoreDependencies"
import RotationSystem from "../../../../schema/rotation/definitions/RotationSystem"
import Outcome from "../../../../definitions/Outcome"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions from "../../../utils/CorePreconditions"
import { findAvailableDropDistance, findAvailableShiftDistance } from "../../../utils/coreOpStateUtils"

let resolveRotation = (rotation: Rotation) => Operation.Resolve(({ state }, dependencies: CoreDependencies) => {
    let { operations, schema } = dependencies
    let previousPlayfield = [...state.playfield.map(row => [...row])]

    let rotationResult = schema.rotationSystem.rotate({ rotation, state })

    switch (rotationResult.classifier) {
        case Outcome.Classifier.Failure:
            return Operation.None
        case Outcome.Classifier.Success:
            return Operation.Sequence(
                draftRotationResult(rotationResult.data),
                resolveDistanceCalculations, // Order matters - This relies on new state from draftRotationResult(...) 
                operations.refreshGhost.applyIf(rotationResult.data.unadjustedCoordinates != null),
                operations.updateLockStatus(MovementType.Rotate),
                Operation.Draft(({ state, events }) => { 
                    events.push(GameEvent.Rotate({
                        rotation,
                        previousPlayfield,
                        playfield: state.playfield,
                        activePiece: state.activePiece
                    }))
                })
            )
    }
})

let resolveDistanceCalculations = Operation.Resolve(({ state }, { schema }) => {
    let { activePiece, playfield } = state
    let distanceCalculationInfo = { coordinates: activePiece.coordinates, playfield, playfieldSpec: schema.playfield }
    let maxDropDistance = findAvailableDropDistance(distanceCalculationInfo)
    let maxLeftShiftDistance = findAvailableShiftDistance(ShiftDirection.Left, distanceCalculationInfo)
    let maxRightShiftDistance = findAvailableShiftDistance(ShiftDirection.Right,distanceCalculationInfo)
    return Operation.Draft(({ state }) => { 
        state.activePiece.availableDropDistance = maxDropDistance
        state.activePiece.availableShiftDistance[ShiftDirection.Left] = maxLeftShiftDistance
        state.activePiece.availableShiftDistance[ShiftDirection.Right] = maxRightShiftDistance
    })
})

let draftRotationResult = (result: RotationSystem.RotateResult) => {
    return Operation.Draft(({ state }) => {
        let { newOrientation, offset, unadjustedCoordinates } = result
        let { coordinates, location, id } = state.activePiece
    
        if (newOrientation != undefined) {
            state.activePiece.orientation = newOrientation
        }
        if (offset && unadjustedCoordinates) {
            coordinates.forEach(c => state.playfield[c.y][c.x] = Cell.Empty)
            coordinates.forEach((c, i) => {
                coordinates[i].x = unadjustedCoordinates[i].x + offset[0]
                coordinates[i].y = unadjustedCoordinates[i].y + offset[1]
                state.playfield[c.y][c.x] = Cell.Active(id)
            })
            location.x += offset[0]
            location.y += offset[1]
        }
    })
}

let rootOperation = (rotation: Rotation) => Operation.Resolve((_, { operations }) => {
    return Operation.Sequence(
        resolveRotation(rotation),
        operations.continueInstantDrop,
        operations.continueInstantShift
    )
})

export default (rotation: Rotation) => Operation.Export({
    operationName: "rotate",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: rootOperation(rotation)
})
