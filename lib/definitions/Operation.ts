
import { OperationResult } from "../exec";
import Dependencies from "./Dependencies";
import { State } from "./stateTypes";
import type { Draft } from "immer";

type Operation<S extends State> = Operation.Drafter<S> | Operation.Provider<S> | Operation.Sequencer<S>

namespace Operation {


    export type DrafterFunc<S extends State> = (draft: Draft<OperationResult<S>>) => void
    export type ProviderFunc<S extends State> = (result: OperationResult<S>, dependencies: Dependencies<S>) => Operation<S>

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
    export type Drafter<S extends State> = { 
        classifier: Classifier.Drafter, 
        draft: DrafterFunc<S>,
        args?: OpArgs 
    }

    /**
     * Providers form more complex logic by chaining together Drafters and other Providers.
     * They have access to a read-only copy of the state and return some other operation. To modify the state, use a Drafter instead 
     */
    export type Provider<S extends State> = { 
        classifier: Classifier.Provider,
        provide: ProviderFunc<S>, 
        args?: OpArgs 
    }

    /**
     * A sequencer is an operation which is composed of a list of other operations which should be performed sequentally 
     */
    export type Sequencer<S extends State> = {
        classifier: Classifier.Sequencer,
        operations: Operation<S>[]
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

    export function Draft<S extends State>(draft: DrafterFunc<S>, args?: OpArgs): Drafter<S> {
        return { classifier: Classifier.Drafter, draft, args }
    }

    export function DraftStrict<S extends State>(draft: DrafterFunc<S>): Drafter<S> {
        return { classifier: Classifier.Drafter, draft, args: { strict: true } }
    }

    export function Provide<S extends State>(provide: ProviderFunc<S>, args?: OpArgs): Provider<S> {
        return { classifier: Classifier.Provider, provide, args }
    }

    export function ProvideStrict<S extends State>(provide: ProviderFunc<S>): Provider<S> {
        return { classifier: Classifier.Provider, provide, args: { strict: true } }
    }

    export function Sequence<S extends State>(...operations: Operation<S>[]): Sequencer<S> {
        return { classifier: Classifier.Sequencer, operations }
    }

    export function SequenceStrict<S extends State>(...operations: Operation<S>[]): Provider<S> {
        return Provide(() => Sequence(...operations), { strict: true })
    }

    export let None = Sequence()

    export function applyIf<S extends State>(condition: boolean, operation: Operation<S>): Operation<S> {
        return condition ? operation : Operation.None;
    }

}

export default Operation