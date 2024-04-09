import CoreReducers from "./definitions/CoreReducers"
import CoreState from "./definitions/CoreState"
import CoreDependencies from "./definitions/CoreDependencies"
import ReducerResult from "./definitions/CoreReducerResult"
import startDAS from "./reducers/member/movement/startDAS"
import startAutoShift from "./reducers/member/movement/startAutoShift"
import hold from "./reducers/member/hold"
import refreshGhost from "./reducers/member/refreshGhost"
import lock from "./reducers/member/lock"
import startSoftDrop from "./reducers/member/movement/startSoftDrop"
import next from "./reducers/member/next"
import completePendingMovement from "./reducers/member/movement/completePendingMovement"
import continueInstantDrop from "./reducers/member/movement/continueInstantDrop"
import continueInstantShift from "./reducers/member/movement/continueInstantShift"
import hardDrop from "./reducers/member/movement/hardDrop"
import cancelSoftDrop from "./reducers/member/movement/cancelSoftDrop"
import triggerLockdown from "./reducers/root/triggerLockdown"
import refillQueue from "./reducers/member/refillQueue"
import spawn from "./reducers/member/spawn"
import rotate from "./reducers/member/movement/rotate"
import drop from "./reducers/member/movement/drop"
import shift from "./reducers/member/movement/shift"
import updateLockStatus from "./reducers/member/updateLockStatus"
import startShiftInput from "./reducers/member/movement/startShiftInput"
import endShiftInput from "./reducers/member/movement/endShiftInput"

export default {
    startDAS,
    startAutoShift,
    hold,
    refreshGhost,
    lock,
    startSoftDrop,
    next,
    refillQueue,
    completePendingMovement,
    continueInstantDrop,
    continueInstantShift,
    hardDrop,
    cancelSoftDrop,
    spawn,
    rotate,
    drop,
    shift,
    updateLockStatus,
    startShiftInput,
    endShiftInput,
    triggerLockdown
} satisfies CoreReducers<CoreState, CoreDependencies, ReducerResult<CoreState>>