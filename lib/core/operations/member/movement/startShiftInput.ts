import Operation from "../../../definitions/CoreOperation"
import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions from "../../../utils/CorePreconditions"

const draftChanges = (direction: ShiftDirection) => Operation.Draft(({ state }) => {
    state.shiftDirection = direction
    if (!state.settings.das.interruptionEnabled) {
        state.dasCharged[ShiftDirection.opposite(direction)] = false
    }
})

const rootOperation = (direction: ShiftDirection) => Operation.Resolve((_, { operations }) => {
    return Operation.Sequence(draftChanges(direction), operations.shift(1), operations.startDAS)
})

export default (direction: ShiftDirection) => Operation.Export({
    operationName: "startShiftInput",
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ],
    rootOperation: rootOperation(direction)
})