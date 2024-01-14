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
import DropType from "../../../definitions/DropType"
import Input from "../../../definitions/Input"
import TimerOperation from "../../definitions/TimerOperation"
import TimerName from "../../definitions/TimerName"
import SideEffectRequest from "../../definitions/SideEffectRequest"
import { findAvailableDropDistance, findAvailableShiftDistance } from "../../utils/coreOpStateUtils"
import { gridToList } from "../../../util/sharedUtils"

const resolveDropContinuation = Operation.Resolve(({ state }, { operations }) => {
    const { activePiece, settings, activeInputs } = state
    const softDropActive = activeInputs.some(input => input.classifier == Input.ActiveGame.Classifier.SD)
    if (!softDropActive) {
        return Operation.None
    }
    const draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.TimerOperation({
            timerName: TimerName.Drop,
            operation: TimerOperation.Start
        }))
    })
    const shouldInstantDrop = settings.softDropInterval === 0 && activePiece.availableDropDistance > 0 && softDropActive
    return shouldInstantDrop ? operations.drop(DropType.Soft, activePiece.availableDropDistance) : draftTimerChange
})

const resolveShiftContinuation = Operation.Resolve(({ state }, { operations }) => {
    if (state.dasCharged[state.shiftDirection]) {
        return operations.startAutoShift
    }
    const activeShiftInput = state.activeInputs.some(input => {
        return input.classifier == Input.ActiveGame.Classifier.Shift && input.direction == state.shiftDirection
    })
    return activeShiftInput ? operations.startDAS : Operation.None
})

const rootOperation = (pieceId: PieceIdentifier) => {
    return Operation.Resolve(({ state }, { operations, schema }) => {
        const playfield = state.playfield
        const { grid, orientation, location } = schema.rotationSystem.getSpawnInfo({ pieceId, state })
        const coordinates = gridToList(grid, location.x, location.y, 1)

        // Detect game over
        if (coordinates.some(c => Cell.isLocked(playfield[c.y][c.x]))) {
            return Operation.Draft(({ state, sideEffectRequests }) => {
                state.status = GameStatus.GameOver//(GameOverCondition.Blockout)
                sideEffectRequests.push(...SideEffectRequest.OnAllTimers(TimerOperation.Cancel))
            })
        }
        const distanceCalculationInfo = { coordinates, playfield, playfieldSpec: schema.playfield }
        const availableDropDistance = findAvailableDropDistance(distanceCalculationInfo)
        const availableShiftDistance = {
            [ShiftDirection.Left]: findAvailableShiftDistance(ShiftDirection.Left, distanceCalculationInfo),
            [ShiftDirection.Right]: findAvailableShiftDistance(ShiftDirection.Right, distanceCalculationInfo)
        }
        const newActivePiece: ActivePiece = {
            id: pieceId,
            location,
            coordinates,
            orientation,
            ghostCoordinates: [],
            maxDepth: 0,
            availableDropDistance,
            availableShiftDistance
        }
        const draftNewActivePiece = Operation.Draft(({ state, events }) => {
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