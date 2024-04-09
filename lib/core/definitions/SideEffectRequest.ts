import TimerName from "./TimerName"
import CoreReducer from "./CoreReducer"

type SideEffectRequest = SideEffectRequest.Types.StartTimer
    | SideEffectRequest.Types.CancelTimer
    | SideEffectRequest.Types.Rng

namespace SideEffectRequest {

    export enum Classifier {
        StartTimer,
        CancelTimer,
        Rng
    }

    export namespace Types {

        export interface StartTimer extends Params.StartTimer {
            classifier: Classifier.StartTimer
        }

        export interface CancelTimer extends Params.CancelTimer {
            classifier: Classifier.CancelTimer
        }

        export interface Rng {
            classifier: Classifier.Rng,
            quantity: number
        }

    }

    export namespace Params {

        export interface StartTimer {
            timerName: TimerName,
            delay: number,
            postDelayOp: CoreReducer
        }

        export interface CancelTimer {
            timerName: TimerName
        }

    }

}

// Convenience
namespace SideEffectRequest {

    export const StartTimer = (params: {
        delay: number;
        timerName: TimerName;
        postDelayOp: CoreReducer
    }) => {
        return { classifier: Classifier.StartTimer, ...params } satisfies Types.StartTimer
    }

    export const CancelTimer = (params: Params.CancelTimer) => {
        return { classifier: Classifier.CancelTimer, ...params } satisfies Types.CancelTimer
    }

    export const Rng = (params: { quantity: number }) => {
        return { classifier: Classifier.Rng, quantity: params.quantity } satisfies Types.Rng
    }

}

export default SideEffectRequest