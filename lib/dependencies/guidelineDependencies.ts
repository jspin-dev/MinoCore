import Dependencies from "../definitions/CoreDependencies";
import { Randomization, Settings } from "../definitions/settingsDefinitions";
import State from "../definitions/CoreState";
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
import syncPreviewGrid from "../operations/next/syncPreviewGrid";
import validatePreviewGrids from "../operations/next/validatePreviewGrids";
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
import { PresetRandomizers } from "./randomizers";
import CoreDependencies from "../definitions/CoreDependencies";

export default function(settings: Settings): CoreDependencies {
    let queueOperations;
    switch(settings.randomization) {
        case Randomization.Classic:
            queueOperations = PresetRandomizers.Classic.operations;
        case Randomization.Bag:
            queueOperations = PresetRandomizers.NBag.operations;
    }
    return { 
        defaultSettings: settings,
        operations: { 
            enqueueFull: queueOperations.enqueueFull,
            enqueueNext: queueOperations.enqueueNext, 
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
            syncPreviewGrid,
            validatePreviewGrids,
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
