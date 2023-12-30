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

namespace LockdownStatus {

    export let Triggered: TriggeredType = {
        classifier: Classifier.Triggered
    }

    export let NoLockdown: NoLockdownType = {
        classifier: Classifier.NoLockdown
    }

    export let TimerActive = (movesRemaining: number): TimerActiveType => {
        return {
            classifier: Classifier.TimerActive,
            movesRemaining
        }
    }

}

export default LockdownStatus