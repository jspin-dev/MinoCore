type Outcome<T> = Outcome.SuccessType<T> | Outcome.FailureType

namespace Outcome {

    export enum Classifier {
        Failure,
        Success
    }

    export interface SuccessType<T> {
        classifier: Classifier.Success,
        data: T
    }

    export interface FailureType {
        classifier: Classifier.Failure,
        error?: string
    }

}

// Convenience
namespace Outcome {

    export const Success = <T>(data: T) => {
        return { classifier: Classifier.Success, data } satisfies Outcome.SuccessType<T>
    }

    export const Failure = (error?: string) => {
        return { classifier: Classifier.Failure, error } satisfies Outcome.FailureType
    }

    export const isSuccess = <T>(outcome: Outcome<T>): outcome is Outcome.SuccessType<T> => {
        return outcome?.classifier == Outcome.Classifier.Success
    }

    export const isFailure = <T>(outcome: Outcome<T>): outcome is Outcome.FailureType => {
        return outcome?.classifier == Outcome.Classifier.Failure
    }

}

export default Outcome