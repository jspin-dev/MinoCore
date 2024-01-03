import Operation from "../../definitions/CoreOperation"
import GameEvent from "../../../definitions/GameEvent"
import GameStatus from "../../definitions/GameStatus"
import LockdownStatus from "../../definitions/LockdownStatus"
import SideEffect from "../../definitions/SideEffectRequest"
import Cell from "../../../definitions/Cell"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import ShiftDirection from "../../../definitions/ShiftDirection"
import ActivePiece from "../../../definitions/ActivePiece"
import CorePreconditions from "../../utils/CorePreconditions"
import PendingMovement from "../../definitions/PendingMovement"
import DropType from "../../../definitions/DropType"
import Input from "../../../definitions/Input"
import TimerOperation from "../../definitions/TimerOperation"
import TimerName from "../../definitions/TimerName"
import SideEffectRequest from "../../definitions/SideEffectRequest"
import { findAvailableDropDistance, findAvailableShiftDistance } from "../../utils/coreOpStateUtils"
import { gridToList } from "../../../util/sharedUtils"

let resolveDropContinuation = Operation.Resolve(({ state }, { operations }) => {
    let { activePiece, settings, pendingMovement } = state
    let softDropPending = PendingMovement.isDrop(pendingMovement) && pendingMovement.type == DropType.Soft
    if (!softDropPending) {
        return Operation.None
    }
    let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.TimerOperation({
            timerName: TimerName.AutoDrop,
            operation: TimerOperation.Start
        }))
    })
    let shouldInstantDrop = settings.softDropInterval === 0 && activePiece.availableDropDistance > 0 && softDropPending
    return shouldInstantDrop ? operations.drop(DropType.Soft, activePiece.availableDropDistance) : draftTimerChange
})

let resolveShiftContinuation = Operation.Resolve(({ state }, { operations }) => {
    if (state.dasCharged[state.shiftDirection]) {
        return operations.startAutoShift
    }
    let activeShiftInput = state.activeInputs.some(input => {
        return input.classifier == Input.ActiveGame.Classifier.Shift && input.direction == state.shiftDirection
    })
    return activeShiftInput ? operations.startDAS : Operation.None
})

let rootOperation = (pieceId: PieceIdentifier) => {
    return Operation.Resolve(({ state }, { operations, schema }) => {
        let playfield = state.playfield
        let { grid, orientation, location } = schema.rotationSystem.getSpawnInfo({ pieceId, state })
        let coordinates = gridToList(grid, location.x, location.y, 1)

        // Detect game over
        if (coordinates.some(c => Cell.isLocked(playfield[c.y][c.x]))) {
            return Operation.Draft(({ state, sideEffectRequests }) => {
                state.status = GameStatus.GameOver//(GameOverCondition.Blockout)
                sideEffectRequests.push(...SideEffectRequest.OnAllTimers(TimerOperation.Cancel))
            })
        }
        let distanceCalculationInfo = { coordinates, playfield, playfieldSpec: schema.playfield }
        let availableDropDistance = findAvailableDropDistance(distanceCalculationInfo)
        let availableShiftDistance = {
            [ShiftDirection.Left]: findAvailableShiftDistance(ShiftDirection.Left, distanceCalculationInfo),
            [ShiftDirection.Right]: findAvailableShiftDistance(ShiftDirection.Right, distanceCalculationInfo)
        }
        let newActivePiece: ActivePiece = {
            id: pieceId,
            location,
            coordinates,
            orientation,
            ghostCoordinates: [],
            maxDepth: 0,
            availableDropDistance,
            availableShiftDistance
        }
        let draftNewActivePiece = Operation.Draft(({ state, events }) => {
            state.lockdownStatus = LockdownStatus.NoLockdown
            state.activePiece = newActivePiece
            state.activePiece.coordinates.forEach(c => state.playfield[c.y][c.x] = Cell.Active(newActivePiece.id))
            events.push(GameEvent.Spawn({ activePiece: state.activePiece }))
        })

        return Operation.Sequence(
            draftNewActivePiece,
            operations.refreshGhost,
            //operations.drop(1),
            resolveShiftContinuation,
            resolveDropContinuation
        )
    })
}

/**
 * Spawns a piece (indicated by pieceId) at the top of the playfield,
 * If no collision, creates an active piece with new coordinates
 */
export default (pieceId: PieceIdentifier) => Operation.Export({
    operationName: "spawn",
    preconditions: [ CorePreconditions.activeGame ],
    rootOperation: rootOperation(pieceId)
})
