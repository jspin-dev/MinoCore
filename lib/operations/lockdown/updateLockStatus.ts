import ActivePiece from "../../definitions/ActivePiece";
import Operation from "../../definitions/CoreOperation";
import LockdownInfo from "../../definitions/LockdownInfo";
import LockdownReset from "../../definitions/LockdownReset";
import LockdownStatus from "../../definitions/LockdownStatus";
import MovementType from "../../definitions/MovementType";
import Settings from "../../definitions/Settings";
import SideEffect from "../../definitions/SideEffect";
import { onFloor } from "../../util/stateUtils";

export default (movementType: MovementType) => Operation.Util.requireActiveGame(
    Operation.Sequence(
        resolveMovementReset(movementType),
        draftMovesCount.applyIf( movementType == MovementType.Shift || movementType == MovementType.Rotate),
        lockOnFloor,
        setLargestY
    )
)

let draftLockdownStatus = Operation.Draft(({ state }) => { 
    state.lockdownInfo.status = LockdownStatus.TimerActive(getMoveLimit(state.settings)) 
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

let draftMovesCount = Operation.Draft(({ state }) => {
    let lockdownStatus = state.lockdownInfo.status;
    if (lockdownStatus.classifier == LockdownStatus.Classifier.TimerActive) {
        let status = lockdownStatus as LockdownStatus.TimerActiveType;
        if (status.movesRemaining) {
            state.lockdownInfo.status = LockdownStatus.TimerActive(status.movesRemaining - 1);
        }
    }
})

let shouldResetTimerOnMove = (lockdownInfo: LockdownInfo, settings: Settings): boolean => {
    let lockdownStatus = lockdownInfo.status;
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

let shouldResetTimerAndStatusOnDrop = (lockdownInfo: LockdownInfo, activePiece: ActivePiece): boolean => {
    let lockdownStatus = lockdownInfo.status;
    if (lockdownStatus.classifier != LockdownStatus.Classifier.NoLockdown) {
        let y = activePiece.location.y;
        if (y > lockdownInfo.largestY) {
            return true;
        }
    }
    return false;
}

let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
    sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.DropLock, SideEffect.TimerOperation.Start))
})

let lockOnFloor = Operation.Resolve(({ state }, { operations, schema }) => {
    let { activePiece, playfieldGrid } = state;
    let collisionPrereqisites = { activePiece, playfieldGrid, playfieldSpec: schema.playfield };
    if (onFloor(collisionPrereqisites)) {
        let lockdownStatus = state.lockdownInfo.status;
        switch (lockdownStatus.classifier) {
            case LockdownStatus.Classifier.NoLockdown:
                return Operation.Sequence(draftLockdownStatus, draftTimerChange);
            case LockdownStatus.Classifier.Triggered:
                return operations.lock;
        }
    }
    return Operation.None;
})

let resolveMovementReset = (movementType: MovementType) => Operation.Resolve(({ state }) => {
    switch (movementType) {
        case MovementType.Shift:
        case MovementType.Rotate:
            if (shouldResetTimerOnMove(state.lockdownInfo, state.settings)) {
                return draftTimerChange;
            }
            break;
        case MovementType.Drop:
            if (shouldResetTimerAndStatusOnDrop(state.lockdownInfo, state.activePiece)) {
                return Operation.Sequence(draftTimerChange, draftLockdownStatus);
            }
    }
    return Operation.None;
})

let setLargestY = Operation.Draft(({ state }) => { 
    let y = state.activePiece.location.y;
    if (y > state.lockdownInfo.largestY) {
        state.lockdownInfo.largestY = y;
    }
})
