import type { Provider } from "../definitions/operationalDefinitions";
import { LockdownStatus, LockdownReset, LockStatusUpdateType } from "../definitions/lockdownDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { State, Playfield } from "../definitions/stateDefinitions";
import { GameStatus, GameOverCondition, TimerName, TimerOperation } from "../definitions/metaDefinitions";

import { Next } from "./preview";
import PlayfieldDrafters from "../drafters/playfieldDrafters";
import MetaDrafters from "../drafters/metaDrafters";
import HoldDrafters from "../drafters/holdDrafters";
import { clearLines } from "./clear";
import { provideIf } from "../util/providerUtils";
import { findHardDropDistance } from "../util/stateUtils";


let onFloor = ({ playfield, settings}: State): boolean => {
    return findHardDropDistance(playfield, settings) == 0;
}

export namespace UpdateLockStatus {

    let resetTimer = MetaDrafters.Makers.insertTimerOperation(TimerName.DropLock, TimerOperation.Start);

    let decrementMovesRemainingProvider: Provider = {
        provide: ({ playfield }) => {
            let lockdownStatus = playfield.lockdownInfo.status;
            if (lockdownStatus.classifier == LockdownStatus.Classifier.TimerActive) {
                let status = lockdownStatus as LockdownStatus.TimerActiveType;
                if (status.movesRemaining) {
                    let newStatus = LockdownStatus.TimerActive(status.movesRemaining - 1);
                    return PlayfieldDrafters.Makers.setLockdownStatus(newStatus)
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
    
    let resetOnMoveProvider = (updateType: LockStatusUpdateType): Provider => {
        return {
            provide: ({ playfield, settings }) => {
                switch (updateType) {
                    case LockStatusUpdateType.OnShift:
                    case LockStatusUpdateType.OnRotate:
                        if (shouldResetTimerOnMove(playfield, settings)) {
                            return resetTimer;
                        }
                        break;
                    case LockStatusUpdateType.OnDrop:
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
            return y > lockdownInfo.largestY ? PlayfieldDrafters.Makers.setLargestY(y) : [];
        }
    }

    export let provider = (updateType: LockStatusUpdateType): Provider => {
        return {
            requiresActiveGame: true,
            provide: () => [
                resetOnMoveProvider(updateType),
                onFloorProvider,
                ...provideIf(
                    updateType == LockStatusUpdateType.OnShift || updateType == LockStatusUpdateType.OnRotate, 
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
        return PlayfieldDrafters.Makers.setLockdownStatus(newStatus);
    }
}

export namespace Lock {

    let nextProvider: Provider = {
        provide: ({ playfield, settings }) => {
            if (playfield.activePiece.coordinates.every(c => c.y < settings.ceilingRow)) {
                return [
                    MetaDrafters.Makers.updateStatus(GameStatus.GameOver(GameOverCondition.Lockout)),
                    PlayfieldDrafters.Makers.clearActivePiece(false)
                ]
            } else {
                return Next.provider
            }
        }
    }

    export let provider: Provider = {
        requiresActiveGame: true,
        provide: () => [
            HoldDrafters.enable,
            clearLines,
            nextProvider
        ]
    } 

}

export let handleDropLockTimer: Provider = {
    requiresActiveGame: true,
    provide: state => {
        if (onFloor(state)) {
            return Lock.provider;
        } else {
            return PlayfieldDrafters.Makers.setLockdownStatus(LockdownStatus.Triggered)
        }
    }
}