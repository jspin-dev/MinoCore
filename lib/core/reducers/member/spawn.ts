import Input from "../../../definitions/Input"
import SideEffect from "../../definitions/SideEffectRequest"
import TimerName from "../../definitions/TimerName"
import DropType from "../../../definitions/DropType"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import GameOverCheckType from "../../../schema/definitions/GameOverCheckType"
import GameStatus from "../../definitions/GameStatus"
import ShiftDirection from "../../../definitions/ShiftDirection"
import ActivePiece from "../../../definitions/ActivePiece"
import LockdownStatus from "../../definitions/LockdownStatus"
import Cell from "../../../definitions/Cell"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreResult from "../../definitions/CoreResult"
import CoreDependencies from "../../definitions/CoreDependencies"
import Coordinate from "../../../definitions/Coordinate"
import Orientation from "../../../definitions/Orientation"
import CoreReducer from "../../definitions/CoreReducer"

import { gridToList } from "../../../util/sharedUtils"
import { findAvailableDropDistance, findAvailableShiftDistance } from "../../utils/coreOpStateUtils"
import { mapReducer, passthroughReducer, sequence, withCondition, withPreconditions } from "../../../util/reducerUtils"
import { mapPlayfield } from "../../../util/stateUtils"
import { addSideEffectRequest, cancelAllTimers, updateState } from "../../utils/coreReducerUtils"

export const rootReducer = (pieceId: PieceIdentifier) => {
    return mapReducer((result: CoreResult, { schema, reducers }: CoreDependencies) => {
        const state = result.state
        const { grid, orientation, location } = schema.rotationSystem.getSpawnInfo({ pieceId, state })
        const coordinates = gridToList(grid, location.x, location.y, 1)
        const gameOver = schema.gameOverDetector.isGameOver({
            checkType: GameOverCheckType.BeforeSpawn,
            coordinates,
            result
        })
        if (gameOver) {
            return sequence(updateState({ status: GameStatus.GameOver }), cancelAllTimers)
        }
        return sequence(
            setNewActivePiece(pieceId, orientation, location, coordinates),
            reducers.refreshGhost,
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
    const distanceCalculationInfo = { coordinates, playfield: state.playfield, playfieldSpec: schema.playfield }
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

const startSoftDropTimer: CoreReducer = mapReducer(({ state }, { reducers }) => {
    return addSideEffectRequest(
        SideEffect.StartTimer({
            timerName: TimerName.Drop,
            delay: state.settings.dropMechanics.softInterval,
            postDelayOp: sequence(reducers.drop(DropType.Soft, 1), startSoftDropTimer)
        })
    )
})

const resolveDropContinuation = mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => {
    const { activePiece, activeInputs } = state
    if (!activeInputs.some(input => input.classifier == Input.ActiveGame.Classifier.SD)) {
        return passthroughReducer
    }
    return state.settings.dropMechanics.softInterval === 0 && activePiece.availableDropDistance > 0
        ? reducers.drop(DropType.Soft, activePiece.availableDropDistance)
        : startSoftDropTimer
})

const resolveShiftContinuation = mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => {
    if (state.dasCharged[state.shiftDirection]) {
        return reducers.startAutoShift
    }
    const activeShiftInput = state.activeInputs.some(input => {
        return input.classifier == Input.ActiveGame.Classifier.Shift && input.direction == state.shiftDirection
    })
    return withCondition(reducers.startDAS, activeShiftInput)
})

export default (pieceId: PieceIdentifier) => withPreconditions({
    reducerName: "spawn",
    reduce: rootReducer(pieceId),
    preconditions: [ CorePreconditions.activeGame ]
})
