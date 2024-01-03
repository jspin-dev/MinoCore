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

    export let Triggered: TriggeredType = {
        classifier: Classifier.Triggered
    }

    export let NoLockdown: NoLockdownType = {
        classifier: Classifier.NoLockdown
    }

    export let TimerActive = (params: { movesRemaining: number }): TimerActiveType => {
        return {
            classifier: Classifier.TimerActive,
            movesRemaining: params.movesRemaining
        }
    }

    export let equal = (status1: LockdownStatus, status2: LockdownStatus): boolean => {
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