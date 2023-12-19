type Outcome<T> = Outcome.SuccessType<T> | Outcome.FailureType;

namespace Outcome {

    export enum Classifier {
        Success, Failure
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

namespace Outcome {

    export let Success = <T>(data: T): Outcome.SuccessType<T> => {
        return { classifier: Classifier.Success, data }
    }

    export let Failure = (error?: string): Outcome.FailureType => {
        return { classifier: Classifier.Failure, error }
    }

}

export default Outcome;