type LockdownStatus = typeof LockdownStatus.NoLockdown | 
    typeof LockdownStatus.Triggered | 
    LockdownStatus.TimerActiveType

namespace LockdownStatus {

    export interface TimerActiveType {
        classifier: Classifier.TimerActive
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

export default LockdownStatus;