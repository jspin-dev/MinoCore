import TimerName from "./TimerName"
import TimerOp from "./TimerOperation"

type SideEffectRequest = SideEffectRequest.Types.TimerInterval | SideEffectRequest.Types.TimerOperation
    | SideEffectRequest.Types.Rng

namespace SideEffectRequest {

    export enum Classifier {
        TimerInterval,
        TimerOperation,
        Rng
    }

    export namespace Types {

        export interface TimerInterval {
            classifier: Classifier.TimerInterval
            timerName: TimerName
            delay: number
        }

        export interface TimerOperation {
            classifier: Classifier.TimerOperation
            timerName: TimerName
            operation: TimerOp
        }

        export interface Rng {
            classifier: Classifier.Rng,
            quantity: number
        }

    }

}

// Convenience
namespace SideEffectRequest {

    export let TimerInterval = (params: { timerName: TimerName, delay: number }): Types.TimerInterval => {
        return {
            classifier: Classifier.TimerInterval,
            timerName: params.timerName,
            delay: params.delay
        }
    }

    export let TimerOperation = (params: { timerName: TimerName, operation: TimerOp }): Types.TimerOperation => {
        return {
            classifier: Classifier.TimerOperation,
            timerName: params.timerName,
            operation: params.operation
        }
    }

    export let Rng = (params: { quantity: number }): Types.Rng => {
        return { classifier: Classifier.Rng, quantity: params.quantity }
    }

    export let OnAllTimers = (operation: TimerOp) => [
        TimerOperation({ timerName: TimerName.Drop, operation }),
        TimerOperation({ timerName: TimerName.AutoShift, operation }),
        TimerOperation({ timerName: TimerName.Clock, operation }),
        TimerOperation({ timerName: TimerName.DAS, operation }),
        TimerOperation({ timerName: TimerName.DropLock, operation })
    ]

}

export default SideEffectRequest