import type CoreDependencies from "./CoreDependencies"
import Operation from "../../definitions/Operation"
import type CoreState from "./CoreState";
import type OperationResult from "./CoreOperationResult"
import type { Draft } from "immer"

namespace CoreOperation {

    export function Draft<S extends CoreState, R extends OperationResult<S>>(
        draft: (draft: Draft<R>) => void
    ) {
        return Operation.Draft(draft) satisfies Operation.Drafter<R>
    }

    export function Resolve<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        resolve: (result: R, dependencies: D) => Operation<R, D>,
        optionalParams?: Operation.OptionalParams<R>
    ) {
        return Operation.Resolve(resolve, optionalParams) satisfies Operation.Resolver<R, D>
    }

    export function Sequence<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        ...operations: Operation<R, D>[]
    ) {
        return Operation.Sequence(...operations) satisfies Operation.Resolver<R, D>
    }

}

// Convenience functions
namespace CoreOperation {

    export let Export = <S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        params: Operation.Export.Params<R, D>
    ) => {
        return Operation.Export(params) satisfies Operation<R, D>
    }

    export let execute = <S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        operation: Operation<R, D>,
        state: S,
        dependencies: D
    ) => {
        const result = { state: state, sideEffectRequests: [], events: [] } as R
        return operation.execute(result, dependencies) satisfies R
    }

    export let None = Sequence()

}

export default CoreOperation