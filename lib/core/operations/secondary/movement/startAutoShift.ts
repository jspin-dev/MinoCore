import TimerName from "../../../definitions/TimerName"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreResult from "../../../definitions/CoreResult"
import CoreOperation from "../../../definitions/CoreOperation"
import CoreDependencies from "../../../definitions/CoreDependencies"
import { mapOperation, withCondition, sequence, withPreconditions } from "../../../../util/operationUtils"
import { delayOperation, cancelPendingOperations, mapCoreState } from "../../../utils/coreOperationUtils"

const updateTimer: CoreOperation = mapOperation(({ state }, { operations }) => delayOperation({
    timerName: TimerName.AutoShift,
    delayInMillis: state.settings.dasMechanics.autoShiftInterval,
    operation: sequence(operations.shift(1), updateTimer)
}))

const move = mapOperation((previousResult: CoreResult, { operations }: CoreDependencies) => {
    const { activePiece, shiftDirection, settings } = previousResult.state
    const dasMechanics = settings.dasMechanics
    const applyDasPostIntervalShift = withCondition(operations.shift(1), dasMechanics.postDelayShiftEnabled)
    return dasMechanics.autoShiftInterval == 0
        ? operations.shift(activePiece.availableShiftDistance[shiftDirection])
        : sequence(applyDasPostIntervalShift, updateTimer)
})

const updateDasCharged = mapCoreState(state => {
    return { dasCharged: { ...state.dasCharged, [state.shiftDirection]: true } }
})

const rootOperation = sequence(cancelPendingOperations(TimerName.DAS), updateDasCharged, move)

export default withPreconditions({
    operationName: "startAutoShift",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
