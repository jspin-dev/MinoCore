import CorePreconditions from "../../../utils/CorePreconditions"
import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerName from "../../../definitions/TimerName"
import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import { mapReducer, sequence, withPreconditions } from "../../../../util/reducerUtils"
import {addSideEffectRequest, cancelTimers} from "../../../utils/coreReducerUtils"

const initiateMovement = mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => {
    return state.settings.dasMechanics.delay === 0
        ? reducers.startAutoShift
        : addSideEffectRequest(
            SideEffectRequest.StartTimer({
                timerName: TimerName.DAS,
                delay: state.settings.dasMechanics.delay,
                postDelayOp: reducers.startAutoShift
            })
        )
})

const rootReducer = sequence(cancelTimers(TimerName.DAS, TimerName.AutoShift), initiateMovement)

export default withPreconditions({
    reducerName: "startDAS",
    reduce: rootReducer,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
