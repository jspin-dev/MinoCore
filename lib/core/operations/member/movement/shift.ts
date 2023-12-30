import Cell from "../../../../definitions/Cell"
import Operation from "../../../definitions/CoreOperation"
import MovementType from "../../../../definitions/MovementType"
import PendingMovement from "../../../definitions/PendingMovement"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions from "../../../utils/CorePreconditions"
import { findAvailableDropDistance } from "../../../utils/coreOpStateUtils"

let updateMaxDrop = Operation.Resolve(({ state }, { schema }) => {
    let { activePiece, playfield } = state
    let distanceCalculationInfo = { coordinates: activePiece.coordinates, playfield, playfieldSpec: schema.playfield }
    let maxDropDistance = findAvailableDropDistance(distanceCalculationInfo)
    return Operation.Draft(({ state }) => { state.activePiece.availableDropDistance = maxDropDistance })
})

let draftShift = (dx: number) => Operation.Draft(({ state }) => {
    let netDx = dx * state.shiftDirection
    let { activePiece, playfield, pendingMovement } = state
    activePiece.coordinates.forEach(c => playfield[c.y][c.x] = Cell.Empty)
    activePiece.location.x += netDx
    activePiece.coordinates = activePiece.coordinates.map(c => {
        return { x: c.x + netDx, y: c.y }
    })
    activePiece.coordinates.forEach(c => { playfield[c.y][c.x] = Cell.Active(activePiece.id) })
    activePiece.availableShiftDistance[ShiftDirection.Left] += netDx
    activePiece.availableShiftDistance[ShiftDirection.Right] -= netDx

    let distance = pendingMovement && PendingMovement.isShift(pendingMovement) && pendingMovement.direction == state.shiftDirection
        ? pendingMovement.dx + dx
        : dx
    state.pendingMovement = PendingMovement.Shift(state.shiftDirection, distance)
})

let rootOperation = (dx: number) => Operation.Resolve(({ state }, { operations }) => {
    if (dx <= 0 || state.activePiece.availableShiftDistance[state.shiftDirection] < dx) {
        return Operation.None
    }
    return Operation.Sequence(
        draftShift(dx),
        updateMaxDrop, // Depends on updated playfieldGrid/coordinates from draftShift(dx)
        operations.refreshGhost,
        operations.updateLockStatus(MovementType.Shift),
        operations.continueInstantDrop
    )
})

export let nonNegativePrecondition = (dx: number) => {
    return {
        isValid: () => dx >= 0,
        rationale: `Dx (${dx}) is the magnitude/shift distance and therefore must be non-negative. Direction is handled by the shift operation itself.`
    }
}

export default (dx: number) => Operation.Export({
    operationName: "shift",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece, nonNegativePrecondition(dx) ],
    rootOperation: rootOperation(dx)
})
