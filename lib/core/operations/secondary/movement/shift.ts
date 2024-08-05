import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import PendingMovement from "../../../definitions/PendingMovement"
import CoreState from "../../../definitions/CoreState"
import CorePrecondition from "../../../definitions/CorePrecondition"
import CorePreconditions from "../../../utils/CorePreconditions"
import MovementType from "../../../../definitions/MovementType"

import { updateActivePlayfield } from "../../../../util/stateUtils"
import { findAvailableDropDistance } from "../../../utils/coreOpStateUtils"
import { mapOperation, passthroughOperation, sequence, withPreconditions } from "../../../../util/operationUtils"
import { mapCoreState } from "../../../utils/coreOperationUtils"

const rootOperation = (dx: number) => mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
    if (dx <= 0 || state.activePiece.availableShiftDistance[state.shiftDirection] < dx) {
        return passthroughOperation
    }
    return sequence(
        draftShift(dx),
        updateMaxDrop, // Depends on updated playfieldGrid/coordinates from draftShift(dx)
        operations.refreshGhost,
        operations.updateLockStatus(MovementType.Shift),
        operations.continueInstantDrop
    )
})

const draftShift = (dx: number) => mapCoreState((previousState: CoreState) => {
    const { activePiece, playfield, pendingMovement, shiftDirection } = previousState
    const { location, id, coordinates } = activePiece
    const netDx = dx * previousState.shiftDirection
    const newActivePieceCoordinates = coordinates.map(c => { return { x: c.x + netDx, y: c.y }})
    const newActivePiece = {
        ...activePiece,
        location: { x: location.x + netDx, y: location.y },
        coordinates: newActivePieceCoordinates,
        availableShiftDistance: {
            [ShiftDirection.Left]: activePiece.availableShiftDistance[ShiftDirection.Left] + netDx,
            [ShiftDirection.Right]: activePiece.availableShiftDistance[ShiftDirection.Right] - netDx
        }
    }
    const newPlayfield = updateActivePlayfield({
        playfield,
        activePieceCoordinates: newActivePieceCoordinates,
        pieceId: id
    })
    const shouldAddPendingDistance = pendingMovement
        && PendingMovement.isShift(pendingMovement)
        && pendingMovement.direction == shiftDirection
    const distance = shouldAddPendingDistance ? pendingMovement.dx + dx : dx
    const newPendingMovement = PendingMovement.Shift({ direction: shiftDirection, dx: distance })
    return {
        activePiece: newActivePiece,
        playfield: newPlayfield,
        pendingMovement: newPendingMovement
    }
})

const updateMaxDrop = mapCoreState((previousState: CoreState, { schema }: CoreDependencies) => {
    const { activePiece, playfield } = previousState
    const availableDropDistance = findAvailableDropDistance({
        coordinates: activePiece.coordinates,
        playfield,
        playfieldDimens: schema.playfieldDimens
    })
    return { activePiece: { ...activePiece, availableDropDistance } }
})

const nonNegativePrecondition = (dx: number) => {
    return {
        isValid: () => dx >= 0,
        rationale: () => `Dx (${dx}) is the magnitude/shift distance and therefore must be non-negative. Direction is handled by the shift operation itself.`
    } as CorePrecondition
}

export default (dx: number) => withPreconditions({
    operationName: "shift",
    operation: rootOperation(dx),
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece, nonNegativePrecondition(dx)]
})