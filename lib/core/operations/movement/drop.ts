import CoreResult from "../../definitions/CoreResult"
import GameEvent from "../../../definitions/GameEvent"
import PendingMovement from "../../definitions/PendingMovement"
import CorePreconditions from "../../utils/CorePreconditions"
import ShiftDirection from "../../../definitions/ShiftDirection"
import DropType from "../../../definitions/DropType"
import CoreDependencies from "../../definitions/CoreDependencies"
import CorePrecondition from "../../definitions/CorePrecondition"
import MovementType from "../../../definitions/MovementType";

import { mapOperation, sequence, withPreconditions } from "../../../util/operationUtils"
import { updateActivePlayfield } from "../../../util/stateUtils"
import { findAvailableShiftDistance } from "../../utils/coreOpStateUtils"

const rootOperation = (type: DropType, dy: number) => {
    return mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
        if (dy <= 0 || state.activePiece.availableDropDistance < dy) {
            return operations.updateLockStatus(MovementType.Drop)
        }
        return sequence(
            performDrop(type, dy),
            operations.refreshGhost,
            operations.updateLockStatus(MovementType.Drop),
            operations.continueInstantShift
        )
    })
}

const performDrop = (type: DropType, dy: number) => ({ state, events }: CoreResult, { schema }: CoreDependencies) => {
    const { activePiece, pendingMovement } = state
    const newActivePieceCoordinates = activePiece.coordinates.map(c => {
        return { x: c.x, y: c.y + dy }
    })
    const newPlayfield = updateActivePlayfield({
        playfield: state.playfield,
        activePieceCoordinates: newActivePieceCoordinates,
        pieceId: state.activePiece.id
    })
    const distanceCalculationInfo = {
        coordinates: newActivePieceCoordinates,
        playfield: newPlayfield,
        playfieldDimens: schema.playfield
    }
    const newActivePiece = {
        ...activePiece,
        coordinates: newActivePieceCoordinates,
        location: { x: activePiece.location.x, y: activePiece.location.y + dy },
        availableDropDistance: activePiece.availableDropDistance - dy,
        availableShiftDistance: {
            [ShiftDirection.Right]: findAvailableShiftDistance(ShiftDirection.Right, distanceCalculationInfo),
            [ShiftDirection.Left]: findAvailableShiftDistance(ShiftDirection.Left, distanceCalculationInfo)
        }
    }
    const distance = pendingMovement && PendingMovement.isDrop(pendingMovement) ? pendingMovement.dy + dy : dy
    const updatedEvents = type == DropType.Auto
        ? [...events, GameEvent.Drop({ dy: distance, dropType: type })]
        : events
    const newPendingMovement = type == DropType.Soft || type == DropType.Hard
        ? PendingMovement.Drop({ type, dy: distance })
        : pendingMovement
    return {
        state: { ...state, activePiece: newActivePiece, playfield: newPlayfield, pendingMovement: newPendingMovement },
        events: updatedEvents
    }
}

export const nonNegativePrecondition = (dy: number) => {
    return {
        isValid: () => dy >= 0,
        rationale: () => `Dy (${dy}) by definition must be non-negative for a drop.`
    } satisfies CorePrecondition
}

export default (type: DropType, dy: number) => withPreconditions({
    operationName: "drop",
    operation: rootOperation(type, dy),
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece, nonNegativePrecondition(dy)]
})