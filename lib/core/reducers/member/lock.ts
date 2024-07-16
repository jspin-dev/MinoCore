import GameEvent from "../../../definitions/GameEvent"
import GameStatus from "../../definitions/GameStatus"
import Cell from "../../../definitions/Cell"
import CorePreconditions from "../../utils/CorePreconditions"
import ShiftDirection from "../../../definitions/ShiftDirection"
import TimerName from "../../definitions/TimerName"
import GameOverCheckType from "../../../schema/definitions/GameOverCheckType"
import CoreResult from "../../definitions/CoreResult"
import CoreDependencies from "../../definitions/CoreDependencies"

import { mapPlayfield } from "../../../util/stateUtils"
import { mapReducer, sequence, withCondition, withPreconditions } from "../../../util/reducerUtils"
import { cancelAllTimers, cancelTimer, updateState } from "../../utils/coreReducerUtils"

const lockPlayfield = ({ state, events }: CoreResult) => {
    const newPlayfield = mapPlayfield({
        playfield: state.playfield,
        map: (cell: Cell) => {
            switch (cell.classifier) {
                case Cell.Classifier.Active: return Cell.Locked(cell.pieceId)
                case Cell.Classifier.Ghost: return Cell.Empty
                case Cell.Classifier.Empty:
                case Cell.Classifier.Locked: return cell
            }
        }
    })
    return {
        state:  { ...state, playfield: newPlayfield },
        events: [...events, GameEvent.Lock({ activePiece: state.activePiece }) ]
    }
}

const executePlayfieldElimination = ({ state, events }: CoreResult, { schema }: CoreDependencies) => {
    const { playfield, activePiece } = state
    const result = schema.playfieldReducer.reduce({ playfield, activePiece, schema })
    const event = GameEvent.Clear({ // Uses playfield pre-elimination
        activePiece: state.activePiece,
        linesCleared: result.linesCleared,
        playfield: state.playfield
    })
    return {
        state:  { ...state, playfield },
        events: [...events, event ]
    }
}

const gameOverSequence = sequence(
    updateState({ status: GameStatus.GameOver, activePiece: null }),
    cancelAllTimers
)

const cancelPreservation = mapReducer((result: CoreResult) => {
    const cancel = sequence(
        updateState({ dasCharged: { [ShiftDirection.Right]: false, [ShiftDirection.Left]: false } }),
        cancelTimer(TimerName.AutoShift)
    )
    return withCondition(cancel, !result.state.settings.dasMechanics.preservationEnabled)
})

const resetForNext = sequence(
    updateState({ activePiece: null, holdEnabled: null }),
    cancelTimer(TimerName.DAS),
    cancelPreservation
)

const nextOps = mapReducer((result: CoreResult, { reducers, schema }: CoreDependencies) => {
    const gameOver = schema.gameOverDetector.isGameOver({
        checkType: GameOverCheckType.BeforeNext,
        coordinates: result.state.activePiece.coordinates,
        result
    })
    return sequence(resetForNext, gameOver ? gameOverSequence : reducers.next)
})

const postLockOperations = mapReducer((result: CoreResult, { schema }: CoreDependencies) => {
    const gameOver = schema.gameOverDetector.isGameOver({
        checkType: GameOverCheckType.OnLock,
        coordinates: result.state.activePiece.coordinates,
        result
    })
    return gameOver ? gameOverSequence : sequence(executePlayfieldElimination, nextOps)
})

const rootReducer = sequence(lockPlayfield, cancelTimer(TimerName.DropLock), postLockOperations)
export default withPreconditions({
    reducerName: "lock",
    reduce: rootReducer,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
