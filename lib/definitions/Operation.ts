type Operation<S, D> = (previousState: S, dependencies: D) => Partial<S>
export default Operation