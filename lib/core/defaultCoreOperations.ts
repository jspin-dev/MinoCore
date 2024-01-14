import CoreOperations from "./definitions/CoreOperations"
import CoreState from "./definitions/CoreState"
import OperationResult from "./definitions/CoreOperationResult"
import CoreDependencies from "./definitions/CoreDependencies"
import startDAS from "./operations/member/movement/startDAS"
import startAutoShift from "./operations/member/movement/startAutoShift"
import hold from "./operations/member/hold"
import refreshGhost from "./operations/member/refreshGhost"
import lock from "./operations/member/lock"
import startSoftDrop from "./operations/member/movement/startSoftDrop"
import next from "./operations/member/next"
import refillQueue from "./operations/member/refillQueue"
import completePendingMovement from "./operations/member/movement/completePendingMovement"
import continueInstantDrop from "./operations/member/movement/continueInstantDrop"
import continueInstantShift from "./operations/member/movement/continueInstantShift"
import hardDrop from "./operations/member/movement/hardDrop"
import cancelSoftDrop from "./operations/member/movement/cancelSoftDrop"
import spawn from "./operations/member/spawn"
import rotate from "./operations/member/movement/rotate"
import drop from "./operations/member/movement/drop"
import shift from "./operations/member/movement/shift"
import updateLockStatus from "./operations/member/updateLockStatus"
import startShiftInput from "./operations/member/movement/startShiftInput"
import endShiftInput from "./operations/member/movement/endShiftInput"

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
    endShiftInput
} satisfies CoreOperations<CoreState, CoreDependencies, OperationResult<CoreState>>