import CoreDependencies from "./CoreDependencies"
import Operation from "./Operation"
import { GameStatus } from "./metaDefinitions";
import CoreState from "./CoreState";
import { OperationResult } from "./OperationResult";

namespace CoreOperation {

    export function Draft<S extends CoreState, R extends OperationResult<S>>(
        draft: Operation.DrafterFunc<R>, 
        args?: Operation.OpArgs
    ): Operation.Drafter<R> {
        return Operation.Draft(draft, args);
    }

    export function Provide<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        provide: Operation.ProviderFunc<S, D, R>, 
        args?: Operation.OpArgs
    ): Operation.Provider<S, D, R> {
        return Operation.Provide(provide, args);
    }

    export function Sequence<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        ...operations: Operation<S, D, R>[]
    ): Operation.Sequencer<S, D, R> {
        return Operation.Sequence(...operations);
    }

    export let None = Sequence()

    export function applyIf<S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        condition: boolean, 
        operation: Operation<S, D, R>
    ): Operation<S, D, R> {
        return Operation.applyIf(condition, operation);
    }

    export let requireActiveGame = <S extends CoreState, D extends CoreDependencies, R extends OperationResult<S>>(
        operation: Operation<S, D, R>
    ): Operation<S, D, R> => Operation.Provide(({ state }) => {
        return state.meta?.status != GameStatus.Active ? Operation.None : operation;
    })

}

export default CoreOperation