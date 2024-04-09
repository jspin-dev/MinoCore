import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerName from "../../../definitions/TimerName"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreReducer from "../../../definitions/CoreReducer"
import DropType from "../../../../definitions/DropType"
import { mapReducer, sequence, withPreconditions } from "../../../../util/reducerUtils"
import { addSideEffectRequest } from "../../../utils/coreReducerUtils"

const rootReducer: CoreReducer = mapReducer(({ state }, { reducers }) => addSideEffectRequest(
    SideEffectRequest.StartTimer({
        timerName: TimerName.Drop,
        delay: state.settings.dropMechanics.autoInterval,
        postDelayOp: sequence(reducers.drop(DropType.Auto, 1), rootReducer)
    })
))

export default withPreconditions({
    reducerName: "cancelSoftDrop",
    reduce: rootReducer,
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})