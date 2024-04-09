import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions from "../../../utils/CorePreconditions"
import { sequence, withPreconditions } from "../../../../util/reducerUtils"
import { createStateReducer, provideReducers } from "../../../utils/coreReducerUtils"

const changeDirection =  (direction: ShiftDirection) => createStateReducer(state => {
    let dasInterruptionEnabled = state.settings.dasMechanics.interruptionEnabled
    let oppositeDirection = ShiftDirection.opposite(direction)
    return {
        shiftDirection: direction,
        dasCharged: {
            ...state.dasCharged,
            [oppositeDirection]: dasInterruptionEnabled ? state.dasCharged[oppositeDirection] : false
        }
    }
})

const rootReducer = (direction: ShiftDirection) => provideReducers(reducers => {
    return sequence(changeDirection(direction), reducers.shift(1), reducers.startDAS)
})

export default (direction: ShiftDirection) => withPreconditions({
    reducerName: "startShiftInput",
    reduce: rootReducer(direction),
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})

