import Cell from "../../../definitions/Cell"
import Operation from "../../definitions/CoreOperation"
import GameEvent from "../../../definitions/GameEvent"
import CorePreconditions from "../../utils/CorePreconditions"

let draftHold = Operation.Draft(({ state, events }) => {
    let previousHoldPiece = state.holdPiece
    let holdPiece = state.activePiece.id
    state.holdPiece = holdPiece
    state.holdEnabled = false
    events.push(GameEvent.Hold({ previousHoldPiece, holdPiece }))
})

let draftActivePiece = Operation.Draft(({ state }) => {
    [...state.activePiece.ghostCoordinates, ... state.activePiece.coordinates].forEach(c => {
        state.playfield[c.y][c.x] = Cell.Empty
    })
    state.activePiece = null
})

let rootOperation = Operation.Resolve(({ state }) => {
    /**
     * Note: Unlike most cases, here we are intentionally referencing the
     * original hold state rather than using the resolver's state
     */
    let resolveNextOp = Operation.Resolve((_, { operations }) => {
        return state.holdPiece ? operations.spawn(state.holdPiece) : operations.next
    })

    let operations = Operation.Sequence(draftHold, draftActivePiece, resolveNextOp)
    return operations.applyIf(state.holdEnabled)
})

export default Operation.Export({
    operationName: "hold",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation
})