export type LockdownConfig = {
    resetMethod: LockdownReset.Method,
    delay: number
}

export namespace LockdownReset {

    export type Method = AnyPieceMovementMethod | MaxDropProgressionOnlyMethod

    export enum Classifier {
        AnyPieceMovement,
        MaxDropProgressionOnly
    }

    export type AnyPieceMovementMethod = {
        classifier: Classifier.AnyPieceMovement,
        moveLimit?: number
    }
    
    export type MaxDropProgressionOnlyMethod = {
        classifier: Classifier.MaxDropProgressionOnly
    }

}

export type LockdownInfo = {
    status: LockdownStatus,
    largestY: number
}

export type LockdownStatus = typeof LockdownStatus.NoLockdown | 
    typeof LockdownStatus.Triggered | 
    LockdownStatus.TimerActiveType

export namespace LockdownStatus {

    export type TimerActiveType = {
        classifier: Classifier.TimerActive,
        movesRemaining?: number
    }

    export enum Classifier {
        NoLockdown,
        Triggered,
        TimerActive
    }

    export let Triggered = {
        classifier: Classifier.Triggered
    }

    export let NoLockdown = {
        classifier: Classifier.NoLockdown
    }

    export let TimerActive = (movesRemaining?: number): TimerActiveType => {
        return {
            classifier: Classifier.TimerActive,
            movesRemaining
        }
    }

}

export namespace LockdownPresets {

    export const defaultDelay = 10000;
    export const defaultMoveLimit = 15;

    export const ExtendedPlacement: LockdownConfig = {
        resetMethod: {
            classifier: LockdownReset.Classifier.AnyPieceMovement,
            moveLimit: defaultMoveLimit
        },
        delay: defaultDelay
    }
    
    export const InfinitePlacement: LockdownConfig = {
        resetMethod: { classifier: LockdownReset.Classifier.AnyPieceMovement },
        delay: defaultDelay
    }

    export const Classic: LockdownConfig = {
        resetMethod: { classifier:  LockdownReset.Classifier.MaxDropProgressionOnly },
        delay: defaultDelay
    }

}
