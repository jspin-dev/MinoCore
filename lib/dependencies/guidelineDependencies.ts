import Settings from "../coreOperations/definitions/Settings";
import clearLines from "../coreOperations/operations/misc/clearLines";
import drop from "../coreOperations/operations/drop/drop";
import hardDrop from "../coreOperations/operations/drop/hardDrop";
import setSDF from "../coreOperations/operations/drop/setSDF";
import startSoftDrop from "../coreOperations/operations/drop/startSoftDrop";
import clearGhost from "../coreOperations/operations/ghost/clearGhost";
import refreshGhost from "../coreOperations/operations/ghost/refreshGhost";
import setGhostEnabled from "../coreOperations/operations/ghost/setGhostEnabled";
import hold from "../coreOperations/operations/misc/hold";
import endInput from "../coreOperations/operations/lifecycle/endInput";
import initialize from "../coreOperations/operations/lifecycle/initialize";
import start from "../coreOperations/operations/lifecycle/start";
import startInput from "../coreOperations/operations/lifecycle/startInput";
import togglePause from "../coreOperations/operations/lifecycle/togglePause";
import lock from "../coreOperations/operations/lockdown/lock";
import triggerLockdown from "../coreOperations/operations/lockdown/triggerLockdown";
import updateLockStatus from "../coreOperations/operations/lockdown/updateLockStatus";
import move from "../coreOperations/operations/misc/move";
import addRns from "../coreOperations/operations/next/addRns";
import next from "../coreOperations/operations/next/next";
import prepareQueue from "../coreOperations/operations/next/prepareQueue";
import removeRns from "../coreOperations/operations/next/removeRns";
import rotate from "../coreOperations/operations/rotation/rotate";
import validateRotationSettings from "../coreOperations/operations/rotation/validateRotationSettings";
import cancelAutoShift from "../coreOperations/operations/shift/cancelAutoShift";
import endShiftLeftInput from "../coreOperations/operations/shift/endShiftLeftInput";
import endShiftRightInput from "../coreOperations/operations/shift/endShiftRightInput";
import setARR from "../coreOperations/operations/shift/setARR";
import setDAS from "../coreOperations/operations/shift/setDAS";
import shift from "../coreOperations/operations/shift/shift";
import startAutoShift from "../coreOperations/operations/shift/startAutoShift";
import startDAS from "../coreOperations/operations/shift/startDAS";
import startShiftLeftInput from "../coreOperations/operations/shift/startShiftLeftInput";
import startShiftRightInput from "../coreOperations/operations/shift/startShiftRightInput";
import spawn from "../coreOperations/operations/misc/spawn";
import recordTick from "../coreOperations/operations/lifecycle/recordTick";
import PresetRandomizers from "./randomizers";
import refillQueue from "../coreOperations/operations/next/refillQueue";

export default (settings: Settings) => {
    return { 
        defaultSettings: settings,
        operations: { 
            enqueueFull: PresetRandomizers.NBag.operations.enqueueFull,
            enqueueNext: PresetRandomizers.NBag.operations.enqueueNext, 
            startDAS,
            startAutoShift,
            cancelAutoShift,
            hold,
            clearGhost,
            refreshGhost,
            hardDrop,
            lock,
            triggerLockdown,
            startSoftDrop,
            togglePause, 
            start,   
            initialize, 
            next,     
            validateRotationSettings, 
            startShiftLeftInput,
            startShiftRightInput,
            endShiftLeftInput,
            endShiftRightInput, 
            prepareQueue,
            recordTick,
            refillQueue,
            spawn,
            rotate,
            move,
            drop,
            shift,
            clearLines,
            updateLockStatus,
            setSDF,
            setARR,
            setDAS,
            setGhostEnabled,
            startInput,
            endInput,
            addRns,
            removeRns
        }
    }
}
