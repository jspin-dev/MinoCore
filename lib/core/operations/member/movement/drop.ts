import Cell from "../../../../definitions/Cell"
import Operation from "../../../definitions/CoreOperation"
import MovementType from "../../../../definitions/MovementType"
import PendingMovement from "../../../definitions/PendingMovement"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions, { CorePrecondition } from "../../../utils/CorePreconditions"
import DropType from "../../../../definitions/DropType"
import GameEvent from "../../../../definitions/GameEvent"
import { findAvailableShiftDistance } from "../../../utils/coreOpStateUtils"

const updateMaxShift = Operation.Resolve(({ state }, { schema }) => {
    const { activePiece, playfield } = state
    const distanceCalculationInfo = { coordinates: activePiece.coordinates, playfield, playfieldSpec: schema.playfield }
    const maxRightShiftDistance = findAvailableShiftDistance(ShiftDirection.Right, distanceCalculationInfo)
    const maxLeftShiftDistance = findAvailableShiftDistance(ShiftDirection.Left, distanceCalculationInfo)
    return Operation.Draft(({ state }) => { 
        state.activePiece.availableShiftDistance = {
            [ShiftDirection.Right]: maxRightShiftDistance,
            [ShiftDirection.Left]: maxLeftShiftDistance
        }
    })
})

const draftDrop = (type: DropType, dy: number) => Operation.Draft(({ state, events }) => {
    const { activePiece, playfield, pendingMovement } = state
    activePiece.coordinates.forEach(c => playfield[c.y][c.x] = Cell.Empty)
    activePiece.location.y += dy
    activePiece.coordinates = activePiece.coordinates.map(c => {
        return { x: c.x, y: c.y + dy }
    });
    activePiece.coordinates.forEach(c => { playfield[c.y][c.x] = Cell.Active(activePiece.id) })
    activePiece.availableDropDistance -= dy
    const distance = pendingMovement && PendingMovement.isDrop(pendingMovement) ? pendingMovement.dy + dy : dy
    switch (type) {
        case DropType.Auto:
            events.push(GameEvent.Drop({ dy: distance, dropType: type }))
            break
        case DropType.Hard:
        case DropType.Soft:
            state.pendingMovement = PendingMovement.Drop({ type, dy: distance })
    }
})

const rootOperation = (type: DropType, dy: number) => Operation.Resolve(({ state }, { operations }) => {
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

export const nonNegativePrecondition = (dy: number) => {
    return {
        isValid: () => dy >= 0,
        rationale: `Dy (${dy}) by definition must be non-negative for a drop.`
    } satisfies CorePrecondition
}

export default (type: DropType, dy: number) => Operation.Export({
    operationName: "drop",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece, nonNegativePrecondition(dy) ],
    rootOperation: rootOperation(type, dy)
})
