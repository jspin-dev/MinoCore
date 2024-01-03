import GameEvent from "../../../definitions/GameEvent"
import Operation from "../../definitions/CoreOperation"
import GameStatus from "../../definitions/GameStatus"
import Cell from "../../../definitions/Cell"
import CorePreconditions from "../../utils/CorePreconditions"
import Playfield from "../../../definitions/Playfield"
import ShiftDirection from "../../../definitions/ShiftDirection"
import Coordinate from "../../../definitions/Coordinate"
import SideEffectRequest from "../../definitions/SideEffectRequest"
import TimerName from "../../definitions/TimerName";
import TimerOperation from "../../definitions/TimerOperation"
import { createEmptyGrid } from "../../../util/sharedUtils"

let draftLock = Operation.Draft(({ state, sideEffectRequests, events }) => {
    state.activePiece.ghostCoordinates.forEach(c => state.playfield[c.y][c.x] = Cell.Empty)
    state.activePiece.coordinates.forEach(c => { state.playfield[c.y][c.x] = Cell.Locked(state.activePiece.id) })
    sideEffectRequests.push(SideEffectRequest.TimerOperation({
        timerName: TimerName.DropLock,
        operation: TimerOperation.Cancel
    }))
    events.push(GameEvent.Lock({ activePiece: state.activePiece }))
})

let resolveBlockElimination = Operation.Resolve(({ state }, { schema }) => {
    let { playfield, activePiece } = state
    let hitList = schema.patternDetector.detectEliminationPattern({ playfield, activePiece })
    if (hitList.length == 0) {
        return Operation.None
    }
    let shouldClear = (row: Cell[], y: number): boolean => {
        return row.every((_, x) => hitList.some(c => Coordinate.equal(c, { x, y })))
    }
    let rowsToClear = playfield.reduce((accum, row, y) => shouldClear(row, y) ? [...accum, y] : accum, [] as number[])
    let newPlayfield = clearAndCollapse(playfield, rowsToClear, schema.playfield.columns)
    return Operation.Draft(({ state, events }) => {
        events.push(GameEvent.Clear({ // Uses playfield pre-elimination
            activePiece: state.activePiece,
            linesCleared: rowsToClear,
            playfield: state.playfield
        }))
        state.playfield = newPlayfield
    })
})

let clearAndCollapse = (playfield: Playfield, rows: number[], playfieldWidth: number): Playfield => {
    let reducedPlayfield = playfield.filter((_, y) => !rows.includes(y))
    let reducedHeight = playfield.length - reducedPlayfield.length
    return createEmptyGrid(reducedHeight, playfieldWidth, Cell.Empty as Cell).concat(reducedPlayfield)
}

/**
 * Non-standard gameOver detection used here to avoid the unlikely situation where the player has locked their piece
 * completely above the playfield ceiling, but managed to clear enough lines that those blocks are now completely on
 * the playfield. Technically the piece locked above the playfield, but it doesn't seem like a game over. Resolution to
 * this is that we consider this a game over if BOTH the following are true:
 *      1. All active piece coordinates are above the ceiling
 *      2. At least one of the playfield cells corresponding to the active piece is locked
 */
let resolveNextPiece = Operation.Resolve(({ state }, { operations, schema }) => {
    let gameOver = state.activePiece.coordinates.every(c => c.y < schema.playfield.ceiling)
        && state.activePiece.coordinates.some(c => state.playfield[c.y][c.x].classifier == Cell.Classifier.Locked)
    let draftLockoutStatus = Operation.Draft(({ state, sideEffectRequests }) => {
        state.status = GameStatus.GameOver //(GameOverCondition.Lockout)
        sideEffectRequests.push(...SideEffectRequest.OnAllTimers(TimerOperation.Cancel))
    })
    let draftResets = Operation.Draft(({ state, sideEffectRequests }) => {
        state.activePiece = null
        state.holdEnabled = true
        sideEffectRequests.push(SideEffectRequest.TimerOperation({
            timerName: TimerName.DAS,
            operation: TimerOperation.Cancel
        }))
        if (!state.settings.das.preservationEnabled) {
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
    rootOperation: Operation.Sequence(draftLock, resolveBlockElimination, resolveNextPiece)
})