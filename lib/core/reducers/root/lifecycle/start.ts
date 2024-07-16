import GameStatus from "../../../definitions/GameStatus"
import SideEffectRequest from "../../../definitions/SideEffectRequest"
import TimerName from "../../../definitions/TimerName"
import GameEvent from "../../../../definitions/GameEvent"
import DropType from "../../../../definitions/DropType"
import CoreReducer from "../../../definitions/CoreReducer"

import { mapReducer, sequence } from "../../../../util/reducerUtils"
import { addEvent, addSideEffectRequest, provideReducers, updateState } from "../../../utils/coreReducerUtils"

const startClock: CoreReducer = mapReducer(() => addSideEffectRequest(
    SideEffectRequest.StartTimer({
        timerName: TimerName.Clock,
        delay: 1000,
        postDelayOp: sequence(addEvent(GameEvent.ClockTick()), startClock)
    })
))
const startAutoDrop: CoreReducer = mapReducer(({ state }, { reducers }) => {
    return addSideEffectRequest(
        SideEffectRequest.StartTimer({
            timerName: TimerName.Drop,
            delay: state.settings.dropMechanics.autoInterval,
            postDelayOp: sequence(reducers.drop(DropType.Auto, 1), startAutoDrop)
        })
    )
})

// noinspection JSUnusedGlobalSymbols
export default provideReducers(reducers => sequence(
    updateState({ status: GameStatus.Active }),
    startClock,
    startAutoDrop,
    reducers.next
))