import GameEvent from "../../../definitions/GameEvent"
import Operation from "../../definitions/CoreOperation"
import GameOverCondition from "../../definitions/GameOverCondition"
import GameStatus from "../../definitions/GameStatus"
import Cell from "../../../definitions/Cell"
import SideEffect from "../../definitions/SideEffect"
import CorePreconditions from "../../utils/CorePreconditions"
import ActivePiece from "../../../definitions/ActivePiece"
import Playfield from "../../../definitions/Playfield"

import TimerName = SideEffect.TimerName
import TimerOperation = SideEffect.TimerOperation
import ShiftDirection from "../../../definitions/ShiftDirection";

let draftLock = Operation.Draft(({ state, sideEffectRequests }) => {
    state.activePiece.ghostCoordinates.forEach(c => state.playfield[c.y][c.x] = Cell.Empty)
    state.activePiece.coordinates.forEach(c => { state.playfield[c.y][c.x] = Cell.Locked(state.activePiece.id) })
    state.holdEnabled = true
    sideEffectRequests.push(SideEffect.Request.TimerOperation(TimerName.DropLock, TimerOperation.Cancel))
})

let getLinesToClear = (activePiece: ActivePiece, playfield: Playfield): number[] => {
    let initialResult: number[] = []
    return activePiece.coordinates.reduce((accum, c) => {
        if (!accum.includes(c.y)) {
            if (playfield[c.y].every(cell => !Cell.isEmpty(cell))) {
                return [...accum, c.y];
            }
        }
        return accum;
    }, initialResult)
}


let resolveLineClear = Operation.Resolve(({ state }, { operations }) => {
    let lines = getLinesToClear(state.activePiece, state.playfield)
    // Lock event is added here instead of in the draftLock operation, so we can include the lines we are about to clear
    let draftLockEvent =  Operation.Draft(({ state, events }) => {
        events.push(GameEvent.Lock(state.activePiece, lines, state.playfield)) // Using playfield before line clear
    })
    return Operation.Sequence(draftLockEvent, operations.clearLines(lines))
})

let resolveNextPiece = Operation.Resolve(({ state }, { operations, schema }) => {
    let gameOver = state.activePiece.coordinates.every(c => c.y < schema.playfield.ceiling)
    let draftLockoutStatus = Operation.Draft(({ state, sideEffectRequests }) => {
        state.status = GameStatus.GameOver(GameOverCondition.Lockout)
        sideEffectRequests.push(...SideEffect.Request.OnAllTimers(TimerOperation.Cancel))
    });
    let draftResets = Operation.Draft(({ state, sideEffectRequests }) => {
        state.activePiece = null
        sideEffectRequests.push(SideEffect.Request.TimerOperation(TimerName.DAS, TimerOperation.Cancel))
        if (!state.settings.das.preservationEnabled) {
            state.dasCharged = {
                [ShiftDirection.Right]: false,
                [ShiftDirection.Left]: false
            }
            sideEffectRequests.push(SideEffect.Request.TimerOperation(TimerName.AutoShift, TimerOperation.Cancel))
        }
    })
    return Operation.Sequence(draftResets, gameOver ? draftLockoutStatus : operations.next)
})

export default Operation.Export({
    operationName: "lock",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: Operation.Sequence(draftLock, resolveLineClear, resolveNextPiece)
})