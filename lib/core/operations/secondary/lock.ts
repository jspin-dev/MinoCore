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
import { mapOperation, sequence, withCondition, withPreconditions } from "../../../util/operationUtils"
import { cancelAllPendingOperations, cancelPendingOperations, updateCoreState } from "../../utils/coreOperationUtils"

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

const executePlayfieldReduction = ({ state, events }: CoreResult, { schema }: CoreDependencies) => {
    const result = schema.playfieldReducer.reduce({ coreState: state, playfieldDimens: schema.playfieldDimens })
    const event = GameEvent.Clear({ // Uses playfield pre-reduction
        activePiece: state.activePiece,
        linesCleared: result.linesCleared,
        playfield: state.playfield
    })
    return {
        state:  { ...state, playfield: result.playfield },
        events: [...events, event ]
    }
}

const gameOverSequence = sequence(
    updateCoreState({ status: GameStatus.GameOver, activePiece: null }),
    cancelAllPendingOperations
)

const cancelPreservation = mapOperation((result: CoreResult) => {
    const cancel = sequence(
        updateCoreState({ dasCharged: { [ShiftDirection.Right]: false, [ShiftDirection.Left]: false } }),
        cancelPendingOperations(TimerName.AutoShift)
    )
    return withCondition(cancel, !result.state.settings.dasMechanics.preservationEnabled)
})

const resetForNext = sequence(
    updateCoreState({ activePiece: null }),
    cancelPendingOperations(TimerName.DAS),
    cancelPreservation
)

const nextOps = mapOperation((result: CoreResult, { operations, schema }: CoreDependencies) => {
    const gameOver = schema.gameOverDetector.isGameOver({
        checkType: GameOverCheckType.BeforeNext,
        coordinates: result.state.activePiece.coordinates,
        coreState: result.state
    })
    return sequence(resetForNext, gameOver ? gameOverSequence : operations.next)
})

const postLockOperations = mapOperation((result: CoreResult, { schema }: CoreDependencies) => {
    const gameOver = schema.gameOverDetector.isGameOver({
        checkType: GameOverCheckType.OnLock,
        coordinates: result.state.activePiece.coordinates,
        coreState: result.state
    })
    return gameOver ? gameOverSequence : sequence(executePlayfieldReduction, nextOps)
})

const rootOperation = sequence(lockPlayfield, cancelPendingOperations(TimerName.DropLock), postLockOperations)

export default withPreconditions({
    operationName: "lock",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
