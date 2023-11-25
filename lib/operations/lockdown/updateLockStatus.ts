import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { LockdownReset, LockdownStatus } from "../../definitions/lockdownDefinitions";
import { SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions";
import { Settings } from "../../definitions/settingsDefinitions";
import { Playfield } from "../../definitions/stateTypes";
import { onFloor } from "../../util/stateUtils";
import lock from "./lock";

export default (movementType: MovementType) => Operation.SequenceStrict(
    resetOnMoveProvider(movementType),
    onFloorProvider,
    Operation.applyIf(
        movementType == MovementType.Shift || movementType == MovementType.Rotate, 
        decrementMovesRemainingProvider
    ),
    setLargestY
)

let resetLockdownStatus = Operation.ProvideStrict(({ settings }) => {
    return Operation.Draft(draft => { 
        draft.playfield.lockdownInfo.status = LockdownStatus.TimerActive(getMoveLimit(settings)) 
    })
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

let decrementMovesRemainingProvider = Operation.Provide(({ playfield }) => {
    let lockdownStatus = playfield.lockdownInfo.status;
    if (lockdownStatus.classifier == LockdownStatus.Classifier.TimerActive) {
        let status = lockdownStatus as LockdownStatus.TimerActiveType;
        if (status.movesRemaining) {
            let newStatus = LockdownStatus.TimerActive(status.movesRemaining - 1);
            return Operation.Draft(draft => { draft.playfield.lockdownInfo.status = newStatus })
        }
    }
    return Operation.None;
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

let resetTimer = Operation.Request(SideEffectRequest.TimerOperation(TimerName.DropLock, TimerOperation.Start))

let onFloorProvider = Operation.Provide((state) => {
    if (onFloor(state)) {
        let lockdownStatus = state.playfield.lockdownInfo.status;
        switch (lockdownStatus.classifier) {
            case LockdownStatus.Classifier.NoLockdown:
                return Operation.Sequence(resetLockdownStatus, resetTimer);
            case LockdownStatus.Classifier.Triggered:
                return lock;
        }
    }
    return Operation.None;
})

let resetOnMoveProvider = (movementType: MovementType) => Operation.Provide(({ playfield, settings }) => {
    switch (movementType) {
        case MovementType.Shift:
        case MovementType.Rotate:
            if (shouldResetTimerOnMove(playfield, settings)) {
                return resetTimer;
            }
            break;
        case MovementType.Drop:
            if (shouldResetTimerAndStatusOnDrop(playfield)) {
                return Operation.Sequence(resetTimer, resetLockdownStatus);
            }
    }
    return Operation.None;
})

let setLargestY = Operation.Provide(({ playfield }) => {
    let { activePiece, lockdownInfo } = playfield;
    let y = activePiece.location.y;
    let updateLargestY = Operation.Draft(draft => { draft.playfield.lockdownInfo.largestY = y })
    return Operation.applyIf(y > lockdownInfo.largestY, updateLargestY)
})
