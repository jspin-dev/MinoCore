import GameEvent from "../../../definitions/GameEvent"
import Cell from "../../../definitions/Cell"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreResult from "../../definitions/CoreResult"
import CoreState from "../../definitions/CoreState"
import CoreDependencies from "../../definitions/CoreDependencies"
import Coordinate from "../../../definitions/Coordinate"
import { mapPlayfield } from "../../../util/stateUtils"
import { mapOperation, passthroughOperation, sequence, withPreconditions } from "../../../util/operationUtils"

const rootOperation = mapOperation(({ state }: CoreResult, { operations }: CoreDependencies) => {
    if (!state.holdEnabled) {
        return passthroughOperation
    }
    /**
     * Note: Unlike most cases, here we are intentionally referencing the
     * original state rather than using the state after hold
     */
    const nextOperation = state.holdPiece ? operations.spawn(state.holdPiece) : operations.next
    return sequence(hold, nextOperation)
})

const hold = ({ state, events }: CoreResult) => {
    const previousHoldPiece = state.holdPiece
    const activePiece = state.activePiece
    const holdPiece = activePiece.id
    const coordinatesToClear = [...activePiece.coordinates, ...activePiece.ghostCoordinates]
    const playfield = mapPlayfield({
        playfield: state.playfield,
        map: (cell, coordinate) => Coordinate.includes(coordinatesToClear, coordinate) ? Cell.Empty : cell
    })
    const newState: CoreState = { ...state, holdPiece, playfield, holdEnabled: false, activePiece: null }
    return {
        state: newState,
        events: [...events, GameEvent.Hold({ previousHoldPiece, holdPiece })]
    }
}

export default withPreconditions({
    operationName: "hold",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
