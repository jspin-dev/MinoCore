export default interface Precondition<S> {
    isValid: (state: S) => boolean,
    rationale: (reducerName?: string | null) => string
}
