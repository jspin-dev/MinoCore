import ShiftDirection from "../../../../definitions/ShiftDirection"
import CorePreconditions from "../../../utils/CorePreconditions"
import { sequence, withPreconditions } from "../../../../util/operationUtils"
import { mapCoreState, mapFromOperations } from "../../../utils/coreOperationUtils"

const changeDirection = (direction: ShiftDirection) => mapCoreState(state => {
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

const rootOperation = (direction: ShiftDirection) => mapFromOperations(operations => {
    return sequence(changeDirection(direction), operations.shift(1), operations.startDAS)
})

export default (direction: ShiftDirection) => withPreconditions({
    operationName: "startShiftInput",
    operation: rootOperation(direction),
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})

