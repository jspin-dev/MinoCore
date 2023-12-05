
import type { Draft } from "immer";
import { OperationResult } from "./OperationResult";

type Operation<S, D, R> = Operation.Drafter<R> | Operation.Provider<S, D, R> | Operation.Sequencer<S, D, R>

namespace Operation {

    export type DrafterFunc<R> = (draft: Draft<R>) => void
    export type ProviderFunc<S, D, R> = (result: R, dependencies: D) => Operation<S, D, R>

    export enum Classifier {

        Provider,
        Drafter,
        Sequencer

    }

    export type OpArgs = {
        strict?: boolean, // Strict operations must be executed during an active game, otherwise we throw an error
        description?: string, // For assistence with debugging, when verboseLog = true the description prints to the console when the operation is executed
    }

    /**
     * Drafters provide a draft state which can be safely mutated. See https://github.com/immerjs/immer for more info
     * Logic here should be limited to only what is necessary to make the needed state changes. However, care should still
     * be taken with regards to performance (see https://immerjs.github.io/immer/performance)
     */
    export type Drafter<R> = { 
        classifier: Classifier.Drafter, 
        draft: DrafterFunc<R>,
        args?: OpArgs 
    }

    /**
     * Providers form more complex logic by chaining together Drafters and other Providers.
     * They have access to a read-only copy of the state and return some other operation. To modify the state, use a Drafter instead 
     */
    export type Provider<S, D, R> = { 
        classifier: Classifier.Provider,
        provide: ProviderFunc<S, D, R>, 
        args?: OpArgs 
    }

    /**
     * A sequencer is an operation which is composed of a list of other operations which should be performed sequentally 
     */
    export type Sequencer<S, D, R> = {
        classifier: Classifier.Sequencer,
        operations: Operation<S, D, R>[]
    } 

    /**
     * Each request specifies a side effect to be performed after the new state has been generated
     * Any asynchronous actions (ie. starting/stopping timers, reading/writing data, etc) need to be SideEffectRequests. 
     * Important: All operations are purely functional, so the executor of the root operation is responsible for 
     * consuming the aggregated list of side effects and executing them in a timely fashion
     */

}

// Convenience functions for common operation use cases
namespace Operation {

    export function Draft<R>(draft: DrafterFunc<R>, args?: OpArgs): Drafter<R> {
        return { classifier: Classifier.Drafter, draft, args }
    }

    export function DraftStrict<R>(draft: DrafterFunc<R>): Drafter<R> {
        return { classifier: Classifier.Drafter, draft, args: { strict: true } }
    }

    export function Provide<S, D, R>(provide: ProviderFunc<S, D, R>, args?: OpArgs): Provider<S, D, R> {
        return { classifier: Classifier.Provider, provide, args }
    }

    export function ProvideStrict<S, D, R>(provide: ProviderFunc<S, D, R>): Provider<S, D, R> {
        return { classifier: Classifier.Provider, provide, args: { strict: true } }
    }

    export function Sequence<S, D, R>(...operations: Operation<S, D, R>[]): Sequencer<S, D, R> {
        return { classifier: Classifier.Sequencer, operations }
    }

    export function SequenceStrict<S, D, R>(...operations: Operation<S, D, R>[]): Provider<S, D, R> {
        return Provide(() => Sequence(...operations), { strict: true })
    }

    export let None = Sequence()

    export function applyIf<S, D, R>(condition: boolean, operation: Operation<S, D, R>): Operation<S, D, R> {
        return condition ? operation : Operation.None;
    }

}

export default Operation