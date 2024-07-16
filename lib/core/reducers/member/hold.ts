import GameEvent from "../../../definitions/GameEvent"
import Cell from "../../../definitions/Cell"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreResult from "../../definitions/CoreResult"
import CoreState from "../../definitions/CoreState"
import CoreDependencies from "../../definitions/CoreDependencies"

import { mapPlayfield } from "../../../util/stateUtils"
import { mapReducer, passthroughReducer, sequence, withPreconditions } from "../../../util/reducerUtils"

const rootReducer = mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => {
    if (!state.holdEnabled) {
        return passthroughReducer
    }
    /**
     * Note: Unlike most cases, here we are intentionally referencing the
     * original state rather than using the state after hold
     */
    const nextOperation = state.holdPiece ? reducers.spawn(state.holdPiece) : reducers.next
    return sequence(hold, nextOperation)
})

const hold = ({ state, events }: CoreResult) => {
    const previousHoldPiece = state.holdPiece
    const activePiece = state.activePiece
    const holdPiece = activePiece.id
    const coordinatesToClear = [...activePiece.coordinates, activePiece.ghostCoordinates]
    const playfield = mapPlayfield({
        playfield: state.playfield,
        map: (cell, coordinate) => coordinatesToClear.includes(coordinate)? Cell.Empty : cell
    })
    const newState: CoreState = { ...state, holdPiece, playfield, holdEnabled: false, activePiece: null }
    return {
        state: newState,
        events: [...events, GameEvent.Hold({ previousHoldPiece, holdPiece })]
    }
}

export default withPreconditions({
    reducerName: "hold",
    reduce: rootReducer,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
