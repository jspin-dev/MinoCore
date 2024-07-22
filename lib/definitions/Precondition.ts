export default interface Precondition<S> {
    isValid: (state: S) => boolean,
    rationale: (operationName?: string | null) => string
}
