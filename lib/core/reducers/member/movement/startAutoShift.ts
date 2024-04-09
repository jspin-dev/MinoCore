import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerName from "../../../definitions/TimerName"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreResult from "../../../definitions/CoreResult"
import CoreReducer from "../../../definitions/CoreReducer"
import CoreDependencies from "../../../definitions/CoreDependencies"

import { mapReducer, withCondition, sequence, withPreconditions } from "../../../../util/reducerUtils"
import { addSideEffectRequest, cancelTimer, createStateReducer } from "../../../utils/coreReducerUtils"

const updateTimer: CoreReducer = mapReducer(({ state }, { reducers }) => {
    return addSideEffectRequest(
        SideEffectRequest.StartTimer({
            timerName: TimerName.AutoShift,
            delay: state.settings.dasMechanics.autoShiftInterval,
            postDelayOp: sequence(reducers.shift(1), updateTimer)
        })
    )
})

const move: CoreReducer = mapReducer((previousResult: CoreResult, { reducers }: CoreDependencies) => {
    const { activePiece, shiftDirection, settings } = previousResult.state
    const dasMechanics = settings.dasMechanics
    const applyDasPostIntervalShift = withCondition(reducers.shift(1), dasMechanics.postDelayShiftEnabled)
    return dasMechanics.autoShiftInterval == 0
        ? reducers.shift(activePiece.availableShiftDistance[shiftDirection])
        : sequence(applyDasPostIntervalShift, updateTimer)
})

const updateDasCharged = createStateReducer(state => {
    return {
        dasCharged: { ...state.dasCharged, [state.shiftDirection]: true }
    }
})

const rootReducer = sequence(cancelTimer(TimerName.DAS), updateDasCharged, move)

export default withPreconditions({
    reducerName: "startAutoShift",
    reduce: rootReducer,
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})
