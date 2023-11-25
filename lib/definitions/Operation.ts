
import { SideEffectRequest, TimerName, TimerOperation } from "./metaDefinitions";
import { Dependencies, State } from "./stateTypes";
import type { Draft } from "immer";

namespace Operation {

    export type Any = Drafter | Provider | Sequencer | Requester
    export type DrafterFunc = (draft: Draft<State>) => void
    export type ProviderFunc = (state: State, dependencies: Dependencies) => Operation.Any

    export enum Classifier {

        Provider,
        Drafter,
        Sequencer,
        Requester

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
    export type Drafter = { 
        classifier: Classifier.Drafter, 
        draft: DrafterFunc,
        args?: OpArgs 
    }

    /**
     * Providers form more complex logic by chaining together Drafters and other Providers.
     * They have access to a read-only copy of the state and return some other operation. To modify the state, use a Drafter instead 
     */
    export type Provider = { 
        classifier: Classifier.Provider,
        provide: ProviderFunc, 
        args?: OpArgs 
    }

    /**
     * A sequencer is an operation which is composed of a list of other operations which should be performed sequentally 
     */
    export type Sequencer = {
        classifier: Classifier.Sequencer,
        operations: Operation.Any[]
    } 

    /**
     * Each request specifies a side effect to be performed after the new state has been generated
     * Any asynchronous actions (ie. starting/stopping timers, reading/writing data, etc) need to be SideEffectRequests. 
     * Important: All operations are purely functional, so the executor of the root operation is responsible for 
     * consuming the aggregated list of side effects and executing them in a timely fashion
     */
    export type Requester = {
        classifier: Classifier.Requester,
        request: SideEffectRequest.Any
    }

}

// Convenience functions for common operation use cases
namespace Operation {

    export let Draft = (draft: DrafterFunc, args?: OpArgs): Drafter => {
        return { classifier: Classifier.Drafter, draft, args }
    }

    export let DraftStrict = (draft: DrafterFunc): Drafter => {
        return { classifier: Classifier.Drafter, draft, args: { strict: true } }
    }

    export let Provide = (provide: ProviderFunc, args?: OpArgs): Provider => {
        return { classifier: Classifier.Provider, provide, args }
    }

    export let ProvideStrict = (provide: ProviderFunc): Provider => {
        return { classifier: Classifier.Provider, provide, args: { strict: true } }
    }

    export let Sequence = (...operations: (Operation.Any)[]): Sequencer => {
        return { classifier: Classifier.Sequencer, operations }
    }

    export let SequenceStrict = (...operations: Operation.Any[]): Provider => {
        return Provide(() => Sequence(...operations), { strict: true })
    }

    export let Request = (request: SideEffectRequest.Any): Requester => {
        return {
            classifier: Classifier.Requester,
            request
        }
    }

    export let RequestTimerOp = (timerName: TimerName, operation: TimerOperation): Requester => {
        return {
            classifier: Classifier.Requester,
            request: SideEffectRequest.TimerOperation(timerName, operation)
        }
    }

    export let None = Sequence()

    export function applyIf(condition: boolean, operation: Operation.Any): Operation.Any {
        return condition ? operation : Operation.None;
    }

}

export default Operation