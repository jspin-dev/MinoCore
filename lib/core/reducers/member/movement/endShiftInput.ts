import ShiftDirection from "../../../../definitions/ShiftDirection"
import Input from "../../../../definitions/Input"
import TimerName from "../../../definitions/TimerName"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"

import { mapReducer, passthroughReducer, sequence, withPreconditions } from "../../../../util/reducerUtils"
import { cancelTimers, createStateReducer, updateState } from "../../../utils/coreReducerUtils"

const updateDirection = (direction: ShiftDirection) => {
    return mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => {
        const { shiftDirection, dasCharged, activeInputs } = state
        if (shiftDirection != direction) {
            return passthroughReducer
        }
        const newDirection = ShiftDirection.opposite(direction)
        if (dasCharged[newDirection]) {
            return sequence(updateState({ shiftDirection: newDirection }), reducers.startAutoShift)
        }
        const activeShiftInput = activeInputs.some(input => {
            return input.classifier == Input.ActiveGame.Classifier.Shift && input.direction == newDirection
        })
        return activeShiftInput
            ? sequence(updateState({ shiftDirection: newDirection }), reducers.startDAS)
            : cancelTimers(TimerName.DAS, TimerName.AutoShift)
    })
}

const unchargeDas = (direction: ShiftDirection) => createStateReducer(state => {
    return { dasCharged: { ...state.dasCharged, [direction]: false } }
})

const rootReducer = (direction: ShiftDirection) => sequence(unchargeDas(direction), updateDirection(direction))

export default (direction: ShiftDirection) => withPreconditions({
    reducerName: "endShiftInput",
    reduce: rootReducer(direction),
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})