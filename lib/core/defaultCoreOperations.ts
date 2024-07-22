import CoreOperations from "./definitions/CoreOperations"
import CoreState from "./definitions/CoreState"
import CoreDependencies from "./definitions/CoreDependencies"
import OperationResult from "./definitions/CoreOperationResult"
import startDAS from "./operations/movement/startDAS"
import startAutoShift from "./operations/movement/startAutoShift"
import hold from "./operations/hold"
import refreshGhost from "./operations/refreshGhost"
import lock from "./operations/lock"
import startSoftDrop from "./operations/movement/startSoftDrop"
import next from "./operations/next"
import completePendingMovement from "./operations/movement/support/completePendingMovement"
import continueInstantDrop from "./operations/movement/support/continueInstantDrop"
import continueInstantShift from "./operations/movement/support/continueInstantShift"
import hardDrop from "./operations/movement/hardDrop"
import cancelSoftDrop from "./operations/movement/cancelSoftDrop"
import triggerLockdown from "./operations/triggerLockdown"
import refillQueue from "./operations/refillQueue"
import spawn from "./operations/spawn"
import rotate from "./operations/movement/rotate"
import drop from "./operations/movement/drop"
import shift from "./operations/movement/shift"
import updateLockStatus from "./operations/updateLockStatus"
import startShiftInput from "./operations/movement/startShiftInput"
import endShiftInput from "./operations/movement/endShiftInput"
import addRns from "./operations/addRns";

// noinspection JSUnusedGlobalSymbols
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
    triggerLockdown,
    addRns
} satisfies CoreOperations<CoreState, CoreDependencies, OperationResult<CoreState>>