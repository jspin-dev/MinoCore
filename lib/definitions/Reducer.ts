type Reducer<S, D> = (previousState: S, dependencies: D) => Partial<S>
export default Reducer