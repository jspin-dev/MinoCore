import GameEvent from "../../../definitions/GameEvent"
import Operation from "../../definitions/CoreOperation"
import GameStatus from "../../definitions/GameStatus"
import Cell from "../../../definitions/Cell"
import CorePreconditions from "../../utils/CorePreconditions"
import ShiftDirection from "../../../definitions/ShiftDirection"
import SideEffectRequest from "../../definitions/SideEffectRequest"
import TimerName from "../../definitions/TimerName";
import TimerOperation from "../../definitions/TimerOperation"

const draftLock = Operation.Draft(({ state, sideEffectRequests, events }) => {
    state.activePiece.ghostCoordinates.forEach(c => state.playfield[c.y][c.x] = Cell.Empty)
    state.activePiece.coordinates.forEach(c => { state.playfield[c.y][c.x] = Cell.Locked(state.activePiece.id) })
    sideEffectRequests.push(SideEffectRequest.TimerOperation({
        timerName: TimerName.DropLock,
        operation: TimerOperation.Cancel
    }))
    events.push(GameEvent.Lock({ activePiece: state.activePiece }))
})

const resolvePlayfieldReduction = Operation.Resolve(({ state }, { schema }) => {
    const { playfield, activePiece } = state
    const result = schema.playfieldReducer.reduce({ playfield, activePiece, schema })
    return Operation.Draft(({ state, events }) => {
        events.push(GameEvent.Clear({ // Uses playfield pre-elimination
            activePiece: state.activePiece,
            linesCleared: result.linesCleared,
            playfield: state.playfield
        }))
        state.playfield = result.playfield
    })
})

/**
 * Non-standard gameOver detection used here to avoid the unlikely situation where the player has locked their piece
 * completely above the playfield ceiling, but managed to clear enough lines that those blocks are now completely on
 * the playfield. Technically the piece locked above the playfield, but it doesn't seem like a game over. Resolution to
 * this is that we consider this a game over if BOTH the following are true:
 *      1. All active piece coordinates are above the ceiling
 *      2. At least one of the playfield cells corresponding to the active piece is locked
 */
const resolveNextPiece = Operation.Resolve(({ state }, { operations, schema }) => {
    const gameOver = state.activePiece.coordinates.every(c => c.y < schema.playfield.ceiling)
        && state.activePiece.coordinates.some(c => state.playfield[c.y][c.x].classifier == Cell.Classifier.Locked)
    const draftLockoutStatus = Operation.Draft(({ state, sideEffectRequests }) => {
        state.status = GameStatus.GameOver //(GameOverCondition.Lockout)
        sideEffectRequests.push(...SideEffectRequest.OnAllTimers(TimerOperation.Cancel))
    })
    const draftResets = Operation.Draft(({ state, sideEffectRequests }) => {
        state.activePiece = null
        state.holdEnabled = true
        sideEffectRequests.push(SideEffectRequest.TimerOperation({
            timerName: TimerName.DAS,
            operation: TimerOperation.Cancel
        }))
        if (!state.settings.dasMechanics.preservationEnabled) {
            state.dasCharged = {
                [ShiftDirection.Right]: false,
                [ShiftDirection.Left]: false
            }
            sideEffectRequests.push(SideEffectRequest.TimerOperation({
                timerName: TimerName.AutoShift,
                operation: TimerOperation.Cancel
            }))
        }
    })
    return Operation.Sequence(draftResets, gameOver ? draftLockoutStatus : operations.next)
})

export default Operation.Export({
    operationName: "lock",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: Operation.Sequence(draftLock, resolvePlayfieldReduction, resolveNextPiece)
})