import { LockdownStatus, LockdownReset } from "../definitions/lockdownDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { GameStatus, GameOverCondition, TimerName, TimerOperation } from "../definitions/metaDefinitions";

import { Next } from "./preview";
import { updateStatus, insertTimerOperation } from "./meta";
import { clearLines } from "./clear";
import { provideIf } from "../util/providerUtils";
import { findHardDropDistance } from "../util/stateUtils";
import { clearActivePiece } from "./activePiece";
import { UpdateStatsOnLock } from "./statistics";
import { MovementType } from "../definitions/inputDefinitions";
import { State, Playfield } from "../types/stateTypes";

let onFloor = ({ playfield, settings}: State): boolean => {
    return findHardDropDistance(playfield, settings) == 0;
}

let setLockdownStatus = (status: LockdownStatus): Drafter => {
    return {
        draft: draft => { draft.playfield.lockdownInfo.status = status }
    }
}

export namespace UpdateLockStatus {

    let resetTimer = insertTimerOperation(TimerName.DropLock, TimerOperation.Start);

    let decrementMovesRemainingProvider: Provider = {
        provide: ({ playfield }) => {
            let lockdownStatus = playfield.lockdownInfo.status;
            if (lockdownStatus.classifier == LockdownStatus.Classifier.TimerActive) {
                let status = lockdownStatus as LockdownStatus.TimerActiveType;
                if (status.movesRemaining) {
                    let newStatus = LockdownStatus.TimerActive(status.movesRemaining - 1);
                    return setLockdownStatus(newStatus)
                }
            }
            return [];
        }
    }

    let shouldResetTimerOnMove = (playfield: Playfield, settings: Settings): boolean => {
        let lockdownStatus = playfield.lockdownInfo.status;
        if (lockdownStatus.classifier == LockdownStatus.Classifier.TimerActive) {
            let taStatus = lockdownStatus as LockdownStatus.TimerActiveType;
            let resetMethod = settings.lockdownConfig.resetMethod;
            if (resetMethod.classifier == LockdownReset.Classifier.AnyPieceMovement) {
                let method = resetMethod as LockdownReset.AnyPieceMovementMethod;
                if (!method.moveLimit || taStatus.movesRemaining > 0) {
                    return true;
                }
            }    
        }
        return false;
    }

    let shouldResetTimerAndStatusOnDrop = (playfield: Playfield): boolean => {
        let lockdownStatus = playfield.lockdownInfo.status;
        if (lockdownStatus.classifier != LockdownStatus.Classifier.NoLockdown) {
            let y = playfield.activePiece.location.y;
            if (y > playfield.lockdownInfo.largestY) {
                return true;
            }
        }
        return false;
    }
    
    let onFloorProvider: Provider = {
        provide: (state) => {
            if (onFloor(state)) {
                let lockdownStatus = state.playfield.lockdownInfo.status;
                switch (lockdownStatus.classifier) {
                    case LockdownStatus.Classifier.NoLockdown:
                        return [resetLockdownStatus, resetTimer];
                    case LockdownStatus.Classifier.Triggered:
                        return Lock.provider;
                }
            }
            return [];
        }
    } 
    
    let resetOnMoveProvider = (movementType: MovementType): Provider => {
        return {
            provide: ({ playfield, settings }) => {
                switch (movementType) {
                    case MovementType.Shift:
                    case MovementType.Rotate:
                        if (shouldResetTimerOnMove(playfield, settings)) {
                            return resetTimer;
                        }
                        break;
                    case MovementType.Drop:
                        if (shouldResetTimerAndStatusOnDrop(playfield)) {
                            return [resetTimer, resetLockdownStatus];
                        }
                }
                return [];
            }
        }    
    }

    let setLargestY: Provider = {
        provide: ({ playfield }) => {
            let { activePiece, lockdownInfo } = playfield;
            let y = activePiece.location.y;
            return y > lockdownInfo.largestY 
                ? { draft: draft => { draft.playfield.lockdownInfo.largestY = y } }
                : [];
        }
    }

    export let provider = (movementType: MovementType): Provider => {
        return {
            requiresActiveGame: true,
            provide: () => [
                resetOnMoveProvider(movementType),
                onFloorProvider,
                ...provideIf(
                    movementType == MovementType.Shift || movementType == MovementType.Rotate, 
                    decrementMovesRemainingProvider
                ),
                setLargestY
            ]
        }
    }

}

let getMoveLimit = (settings: Settings): number => {
    switch(settings.lockdownConfig.resetMethod.classifier) {
        case LockdownReset.Classifier.AnyPieceMovement:
            let method = settings.lockdownConfig.resetMethod as LockdownReset.AnyPieceMovementMethod;
            return method.moveLimit;
        case LockdownReset.Classifier.MaxDropProgressionOnly:
            return null;
    }
}

export let resetLockdownStatus: Provider = {
    requiresActiveGame: true,
    provide: ({ settings }) => {
        let newStatus = LockdownStatus.TimerActive(getMoveLimit(settings));
        return setLockdownStatus(newStatus);
    }
}

export namespace Lock {

    let nextProvider: Provider = {
        provide: ({ playfield, settings }) => {
            if (playfield.activePiece.coordinates.every(c => c.y < settings.ceilingRow)) {
                return [
                    updateStatus(GameStatus.GameOver(GameOverCondition.Lockout)),
                    clearActivePiece(false)
                ]
            } else {
                return Next.provider
            }
        }
    }

    let enableHold: Drafter = {
        draft: draft => { draft.hold.enabled = true }
    }

    let getLinesToClear = (playfield: Playfield): number[] => {
        let { activePiece, grid } = playfield;
        return activePiece.coordinates.reduce((accum, c) => {
            if (!accum.includes(c.y)) {
                let rowFull = grid[c.y].every(block => block > 0);
                if (rowFull) {
                    return [...accum, c.y];
                }
            }
            return accum;
        }, [] as number[]);
    }   

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: ({ playfield }) => {
            let linesToClear = getLinesToClear(playfield);
            let previousGrid = playfield.spinSnapshot ? playfield.spinSnapshot.map(row => [...row]) : null;
            return [
                clearLines(linesToClear),
                UpdateStatsOnLock.provider(linesToClear.length, previousGrid),
                enableHold,
                nextProvider
            ]
        }
    } 

}

export let handleDropLockTimer: Provider = {
    requiresActiveGame: true,
    provide: state => {
        if (onFloor(state)) {
            return Lock.provider;
        } else {
            return setLockdownStatus(LockdownStatus.Triggered)
        }
    }
}