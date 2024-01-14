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

    export const TimerInterval = (params: { timerName: TimerName, delay: number }) => {
        return {
            classifier: Classifier.TimerInterval,
            timerName: params.timerName,
            delay: params.delay
        } satisfies Types.TimerInterval
    }

    export const TimerOperation = (params: { timerName: TimerName, operation: TimerOp }) => {
        return {
            classifier: Classifier.TimerOperation,
            timerName: params.timerName,
            operation: params.operation
        } satisfies Types.TimerOperation
    }

    export const Rng = (params: { quantity: number }) => {
        return { classifier: Classifier.Rng, quantity: params.quantity } satisfies Types.Rng
    }

    export const OnAllTimers = (operation: TimerOp) => [
        TimerOperation({ timerName: TimerName.Drop, operation }),
        TimerOperation({ timerName: TimerName.AutoShift, operation }),
        TimerOperation({ timerName: TimerName.Clock, operation }),
        TimerOperation({ timerName: TimerName.DAS, operation }),
        TimerOperation({ timerName: TimerName.DropLock, operation })
    ]

}

export default SideEffectRequest