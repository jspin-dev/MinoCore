import CoreDependencies from "./CoreDependencies"
import Operation from "./Operation"
import CoreState from "./CoreState";
import OperationResult from "./CoreOperationResult";

import { type Draft } from "immer";
import GameStatus from "./GameStatus";

namespace CoreOperation {

    export function Draft<S extends CoreState, R extends OperationResult<S>>(
        draft: (draft: Draft<R>) => void
    ): Operation.Drafter<R> {
        return Operation.Draft(draft);
    }

    export function Provide<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        provide: (result: R, dependencies: D) => Operation<R, D>
    ): Operation.Provider<R, D> {
        return Operation.Provide(provide);
    }

    export function Sequence<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        ...operations: Operation<R, D>[]
    ): Operation.Provider<R, D> {
        return Operation.Sequence(...operations);
    }

    export let None = Sequence()

}

namespace CoreOperation {

    export namespace Util {

        export let requireActiveGame = <S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
            operation: Operation<R, D>
        ): Operation<R, D> => Operation.Provide(({ state }) => {
            return state.status == GameStatus.Active ? operation : Operation.None();
        })

    }

}

export default CoreOperation