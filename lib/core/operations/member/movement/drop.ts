import Cell from "../../../../definitions/Cell"
import Operation from "../../../definitions/CoreOperation"
import MovementType from "../../../../definitions/MovementType"
import PendingMovement from "../../../definitions/PendingMovement"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions from "../../../utils/CorePreconditions"
import DropType from "../../../../definitions/DropType"
import { findAvailableShiftDistance } from "../../../utils/coreOpStateUtils"

let updateMaxShift = Operation.Resolve(({ state }, { schema }) => {
    let { activePiece, playfield } = state
    let distanceCalculationInfo = { coordinates: activePiece.coordinates, playfield, playfieldSpec: schema.playfield }
    let maxRightShiftDistance = findAvailableShiftDistance(ShiftDirection.Right, distanceCalculationInfo)
    let maxLeftShiftDistance = findAvailableShiftDistance(ShiftDirection.Left, distanceCalculationInfo)
    return Operation.Draft(({ state }) => { 
        state.activePiece.availableShiftDistance = {
            [ShiftDirection.Right]: maxRightShiftDistance,
            [ShiftDirection.Left]: maxLeftShiftDistance
        }
    })
})

let draftDrop = (type: DropType, dy: number) => Operation.Draft(({ state }) => {
    let { activePiece, playfield, pendingMovement } = state
    activePiece.coordinates.forEach(c => playfield[c.y][c.x] = Cell.Empty)
    activePiece.location.y += dy
    activePiece.coordinates = activePiece.coordinates.map(c => {
        return { x: c.x, y: c.y + dy }
    });
    activePiece.coordinates.forEach(c => { playfield[c.y][c.x] = Cell.Active(activePiece.id) })
    activePiece.availableDropDistance -= dy
    let distance = pendingMovement && PendingMovement.isDrop(pendingMovement) ? pendingMovement.dy + dy : dy
    state.pendingMovement = PendingMovement.Drop(type, distance)
})

let rootOperation = (type: DropType, dy: number) => Operation.Resolve(({ state }, { operations, schema }) => {
    if (dy <= 0 || state.activePiece.availableDropDistance < dy) {
        return Operation.None
    }
    return Operation.Sequence(
        draftDrop(type, dy),
        updateMaxShift, // Depends on updated playfield/coordinates from draftDrop(...)
        operations.refreshGhost,
        operations.updateLockStatus(MovementType.Drop),
        operations.continueInstantShift
    )
})

export let nonNegativePrecondition = (dy: number) => {
    return {
        isValid: () => dy >= 0,
        rationale: `Dy (${dy}) by definition must be non-negative for a drop.`
    }
}

export default (type: DropType, dy: number) => Operation.Export({
    operationName: "drop",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece, nonNegativePrecondition(dy) ],
    rootOperation: rootOperation(type, dy)
})
