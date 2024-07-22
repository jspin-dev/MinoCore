import TimerName from "./TimerName"
import CoreOperation from "./CoreOperation";
import CoreOperations from "./CoreOperations";
import CoreOperationResult from "./CoreOperationResult";
import CoreState from "./CoreState";
import CoreDependencies from "./CoreDependencies";

type DeferredAction = DeferredAction.DelayOperation | DeferredAction.AddRns | DeferredAction.CancelOperation

namespace DeferredAction {

    export enum Classifier {
        DelayOperation,
        CancelOperation,
        AddRns
    }

    export interface DelayOperation extends DelayOperation.Params {
        classifier: Classifier.DelayOperation
    }

    export namespace DelayOperation {

        export interface Params {
            timerName: TimerName
            delayInMillis: number
            operation: CoreOperation
        }

    }

    export interface AddRns extends AddRns.Params {
        classifier: Classifier.AddRns
    }

    export interface CancelOperation {
        classifier: Classifier.CancelOperation,
        timerName: TimerName
    }

    export namespace AddRns {

        export interface Params {
            operation: CoreOperations.AddRns<CoreOperationResult<CoreState>, CoreDependencies>,
            quantity: number
        }

    }

}

// Convenience
namespace DeferredAction {

    export const DelayOperation = (params: DelayOperation.Params) => {
        return { classifier: Classifier.DelayOperation, ...params } satisfies DeferredAction.DelayOperation
    }

    export const CancelOperation = (timerName: TimerName) => {
        return { classifier: Classifier.CancelOperation, timerName } satisfies DeferredAction.CancelOperation
    }

    export const AddRns = (params: AddRns.Params) => {
        return { classifier: Classifier.AddRns, ...params } satisfies DeferredAction.AddRns
    }

}

export default DeferredAction