import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { LockdownReset, LockdownStatus } from "../../definitions/lockdownDefinitions";
import { SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions";
import { Settings } from "../../definitions/settingsDefinitions";
import { Playfield } from "../../definitions/stateTypes";
import { onFloor } from "../../util/stateUtils";

let exportedOperation = (movementType: MovementType) => {
    return Operation.SequenceStrict(
        resetOnMoveProvider(movementType),
        onFloorProvider,
        Operation.applyIf(
            movementType == MovementType.Shift || movementType == MovementType.Rotate, 
            decrementMovesRemaining
        ),
        setLargestY
    )
}

let resetLockdownStatus = Operation.Draft(({ state }) => { 
    state.playfield.lockdownInfo.status = LockdownStatus.TimerActive(getMoveLimit(state.settings)) 
})

let getMoveLimit = (settings: Settings): number => {
    switch(settings.lockdownConfig.resetMethod.classifier) {
        case LockdownReset.Classifier.AnyPieceMovement:
            let method = settings.lockdownConfig.resetMethod as LockdownReset.AnyPieceMovementMethod;
            return method.moveLimit;
        case LockdownReset.Classifier.MaxDropProgressionOnly:
            return null;
    }
}

let decrementMovesRemaining = Operation.Draft(({ state }) => {
    let lockdownStatus = state.playfield.lockdownInfo.status;
    if (lockdownStatus.classifier == LockdownStatus.Classifier.TimerActive) {
        let status = lockdownStatus as LockdownStatus.TimerActiveType;
        if (status.movesRemaining) {
            state.playfield.lockdownInfo.status = LockdownStatus.TimerActive(status.movesRemaining - 1);
        }
    }
})

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

let resetTimer = Operation.Draft(({ sideEffectRequests }) => {
    sideEffectRequests.push(SideEffectRequest.TimerOperation(TimerName.DropLock, TimerOperation.Start))
})

let onFloorProvider = Operation.Provide(({ state }, { operations }) => {
    if (onFloor(state)) {
        let lockdownStatus = state.playfield.lockdownInfo.status;
        switch (lockdownStatus.classifier) {
            case LockdownStatus.Classifier.NoLockdown:
                return Operation.Sequence(resetLockdownStatus, resetTimer);
            case LockdownStatus.Classifier.Triggered:
                return operations.lock;
        }
    }
    return Operation.None;
})

let resetOnMoveProvider = (movementType: MovementType) => Operation.Provide(({ state }) => {
    switch (movementType) {
        case MovementType.Shift:
        case MovementType.Rotate:
            if (shouldResetTimerOnMove(state.playfield, state.settings)) {
                return resetTimer;
            }
            break;
        case MovementType.Drop:
            if (shouldResetTimerAndStatusOnDrop(state.playfield)) {
                return Operation.Sequence(resetTimer, resetLockdownStatus);
            }
    }
    return Operation.None;
})

let setLargestY = Operation.Draft(({ state }) => { 
    let { activePiece, lockdownInfo } = state.playfield;
    let y = activePiece.location.y;
    if (y > lockdownInfo.largestY) {
        state.playfield.lockdownInfo.largestY = y;
    }
})

export default exportedOperation;