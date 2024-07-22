import Input from "../../definitions/Input"
import TimerName from "../definitions/TimerName"
import DropType from "../../definitions/DropType"
import PieceIdentifier from "../../definitions/PieceIdentifier"
import GameOverCheckType from "../../schema/definitions/GameOverCheckType"
import GameStatus from "../definitions/GameStatus"
import ShiftDirection from "../../definitions/ShiftDirection"
import ActivePiece from "../../definitions/ActivePiece"
import LockdownStatus from "../definitions/LockdownStatus"
import Cell from "../../definitions/Cell"
import CorePreconditions from "../utils/CorePreconditions"
import CoreResult from "../definitions/CoreResult"
import CoreDependencies from "../definitions/CoreDependencies"
import Coordinate from "../../definitions/Coordinate"
import Orientation from "../../definitions/Orientation"
import CoreOperation from "../definitions/CoreOperation"

import { gridToList } from "../../util/sharedUtils"
import { findAvailableDropDistance, findAvailableShiftDistance } from "../utils/coreOpStateUtils"
import { mapOperation, passthroughOperation, sequence, withCondition, withPreconditions } from "../../util/operationUtils"
import { mapPlayfield } from "../../util/stateUtils"
import {
    delayOperation,
    cancelAllPendingOperations,
    updateCoreState
} from "../utils/coreOperationUtils"

export const rootOperation = (pieceId: PieceIdentifier) => {
    return mapOperation((result: CoreResult, { schema, operations }: CoreDependencies) => {
        const state = result.state
        const { grid, orientation, location } = schema.rotationSystem.getSpawnInfo({ pieceId, state })
        const coordinates = gridToList(grid, location.x, location.y, 1)
        const gameOver = schema.gameOverDetector.isGameOver({
            checkType: GameOverCheckType.BeforeSpawn,
            coordinates,
            coreState: state
        })
        if (gameOver) {
            return sequence(updateCoreState({ status: GameStatus.GameOver }), cancelAllPendingOperations)
        }
        return sequence(
            setNewActivePiece(pieceId, orientation, location, coordinates),
            operations.refreshGhost,
            //drop(1),
            resolveDropContinuation,
            resolveShiftContinuation
        )
    })
}

const setNewActivePiece = (
    pieceId: PieceIdentifier,
    orientation: Orientation,
    location: Coordinate,
    coordinates: Coordinate[]
) => ({ state }: CoreResult, { schema }: CoreDependencies) => {
    const distanceCalculationInfo = { coordinates, playfield: state.playfield, playfieldDimens: schema.playfield }
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
    const playfield = mapPlayfield({
        playfield: state.playfield,
        map: (cell, coordinate) => {
            return coordinates.some(c => Coordinate.equal(c, coordinate)) ? Cell.Active(pieceId) : cell
        }
    })
    return {
        state: {
            ...state,
            lockdownStatus: LockdownStatus.NoLockdown,
            activePiece: newActivePiece,
            playfield
        }
    }
}

// Explicit typing here is necessary to give context to the recursive call
const startSoftDropTimer: CoreOperation = mapOperation(({ state }, { operations }) => {
    return delayOperation({
        timerName: TimerName.Drop,
        delayInMillis: state.settings.dropMechanics.softInterval,
        operation: sequence(operations.drop(DropType.Soft, 1), startSoftDropTimer)
    })
})

const resolveDropContinuation = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
    const { activePiece, activeInputs } = state
    if (!activeInputs.some(input => input.classifier == Input.ActiveGame.Classifier.SD)) {
        return passthroughOperation
    }
    return state.settings.dropMechanics.softInterval === 0 && activePiece.availableDropDistance > 0
        ? operations.drop(DropType.Soft, activePiece.availableDropDistance)
        : startSoftDropTimer
})

const resolveShiftContinuation = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
    if (state.dasCharged[state.shiftDirection]) {
        return operations.startAutoShift
    }
    const activeShiftInput = state.activeInputs.some(input => {
        return input.classifier == Input.ActiveGame.Classifier.Shift && input.direction == state.shiftDirection
    })
    return withCondition(operations.startDAS, activeShiftInput)
})

export default (pieceId: PieceIdentifier) => withPreconditions({
    operationName: "spawn",
    operation: rootOperation(pieceId),
    preconditions: [CorePreconditions.activeGame]
})
