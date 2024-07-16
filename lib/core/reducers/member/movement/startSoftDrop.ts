import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerName from "../../../definitions/TimerName"
import DropType from "../../../../definitions/DropType"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import CoreReducer from "../../../definitions/CoreReducer"

import { addSideEffectRequest } from "../../../utils/coreReducerUtils"
import { mapReducer, sequence, withPreconditions } from "../../../../util/reducerUtils"

const autoDrop: CoreReducer = mapReducer(({ state }, { reducers }) => {
    return addSideEffectRequest(
        SideEffectRequest.StartTimer({
            timerName: TimerName.Drop,
            delay: state.settings.dropMechanics.softInterval,
            postDelayOp: sequence(reducers.drop(DropType.Soft, 1), autoDrop)
        })
    )
})

const rootReducer = mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => {
    let performDrop = state.settings.dropMechanics.softInterval == 0
        ? reducers.drop(DropType.Soft, state.activePiece.availableDropDistance)
        : autoDrop
    return sequence(reducers.drop(DropType.Soft, 1), performDrop)
})

export default withPreconditions({
    reducerName: "startShiftInput",
    reduce: rootReducer,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
