type LockdownStatus = LockdownStatus.NoLockdownType | LockdownStatus.TriggeredType | LockdownStatus.TimerActiveType

namespace LockdownStatus {

    export enum Classifier {
        NoLockdown,
        Triggered,
        TimerActive
    }

    export interface TimerActiveType {
        classifier: Classifier.TimerActive
        movesRemaining?: number
    }

    export interface TriggeredType {
        classifier: Classifier.Triggered
    }

    export interface NoLockdownType {
        classifier: Classifier.NoLockdown
    }

}

// Convenience
namespace LockdownStatus {

    export const Triggered = {
        classifier: Classifier.Triggered
    } satisfies TriggeredType

    export const NoLockdown = {
        classifier: Classifier.NoLockdown
    } satisfies NoLockdownType

    export const TimerActive = (params: { movesRemaining: number }) => {
        return {
            classifier: Classifier.TimerActive,
            movesRemaining: params.movesRemaining
        } satisfies TimerActiveType
    }

    export const equal = (status1: LockdownStatus, status2: LockdownStatus) => {
        if (!status1 && !status2) {
            return true
        }
        if (!status1 || !status2) {
            return false
        }
        switch (status1.classifier) {
            case Classifier.NoLockdown:
            case Classifier.Triggered:
                return status1.classifier == status2.classifier
            case Classifier.TimerActive:
                return status1.classifier == status2.classifier && status1.movesRemaining == status2.movesRemaining
        }
    }

}

export default LockdownStatus