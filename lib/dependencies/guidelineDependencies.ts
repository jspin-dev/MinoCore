import Settings from "../definitions/Settings";
import clearLines from "../operations/clearLines";
import drop from "../operations/drop/drop";
import hardDrop from "../operations/drop/hardDrop";
import setSDF from "../operations/drop/setSDF";
import startSoftDrop from "../operations/drop/startSoftDrop";
import clearGhost from "../operations/ghost/clearGhost";
import refreshGhost from "../operations/ghost/refreshGhost";
import setGhostEnabled from "../operations/ghost/setGhostEnabled";
import hold from "../operations/hold";
import endInput from "../operations/lifecycle/endInput";
import initialize from "../operations/lifecycle/initialize";
import start from "../operations/lifecycle/start";
import startInput from "../operations/lifecycle/startInput";
import togglePause from "../operations/lifecycle/togglePause";
import lock from "../operations/lockdown/lock";
import triggerLockdown from "../operations/lockdown/triggerLockdown";
import updateLockStatus from "../operations/lockdown/updateLockStatus";
import move from "../operations/move";
import addRns from "../operations/next/addRns";
import next from "../operations/next/next";
import prepareQueue from "../operations/next/prepareQueue";
import removeRns from "../operations/next/removeRns";
import rotate from "../operations/rotation/rotate";
import validateRotationSettings from "../operations/rotation/validateRotationSettings";
import cancelAutoShift from "../operations/shift/cancelAutoShift";
import endShiftLeftInput from "../operations/shift/endShiftLeftInput";
import endShiftRightInput from "../operations/shift/endShiftRightInput";
import setARR from "../operations/shift/setARR";
import setDAS from "../operations/shift/setDAS";
import shift from "../operations/shift/shift";
import startAutoShift from "../operations/shift/startAutoShift";
import startDAS from "../operations/shift/startDAS";
import startShiftLeftInput from "../operations/shift/startShiftLeftInput";
import startShiftRightInput from "../operations/shift/startShiftRightInput";
import spawn from "../operations/spawn";
import recordTick from "../operations/lifecycle/recordTick";
import PresetRandomizers from "./randomizers";

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
