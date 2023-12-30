import type CoreDependencies from "./CoreDependencies"
import Operation from "../../definitions/Operation"
import type CoreState from "./CoreState";
import type OperationResult from "./CoreOperationResult"
import type { Draft } from "immer"

namespace CoreOperation {

    export function Draft<S extends CoreState, R extends OperationResult<S>>(
        draft: (draft: Draft<R>) => void
    ): Operation.Drafter<R> {
        return Operation.Draft(draft)
    }

    export function Resolve<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        resolve: (result: R, dependencies: D) => Operation<R, D>,
        optionalParams?: Operation.OptionalParams<R>
    ): Operation.Resolver<R, D> {
        return Operation.Resolve(resolve, optionalParams)
    }

    export function Sequence<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        ...operations: Operation<R, D>[]
    ): Operation.Resolver<R, D> {
        return Operation.Sequence(...operations)
    }

}

// Convenience functions
namespace CoreOperation {

    export let Export = <S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        params: Operation.Export.Params<R, D>
    ): Operation<R, D> => {
        return Operation.Export(params)
    }

    export let None = Sequence()

}

export default CoreOperation