
import { State } from "./stateTypes";
import type { Draft } from "immer";

export namespace Operation {

    export type Any = Drafter | Provider | Sequencer
    export type DrafterFunc = (draft: Draft<State>) => void
    export type ProviderFunc = (state: State) => Operation.Any

    export enum Classifier {

        Provider,
        Drafter,
        Sequence

    }

    export type OpArgs = {
        strict?: boolean, // Strict operations must be executed during an active game, otherwise produces an error
        description?: string // For assistence with debugging, description prints to console whenever an operation is executed
    }

    /**
     * Drafters (called Recipes by immer) provide a draft state which can be safely mutated.
     * See https://github.com/immerjs/immer for more info
     * 
     * Logic here should be limited to only what is necessary to make the needed state changes. However, care should still
     * be taken with regards to performance (see https://immerjs.github.io/immer/performance)
     */
    export type Drafter = { 
        classifier: Classifier.Drafter, 
        draft: DrafterFunc,
        args?: OpArgs 
    }

    /*
     * Providers form more complex logic by chaining together Drafters and other Providers.
     * They have access to a read-only copy of the state (to modify the state, use a Drafter instead) and return any other operation
     */
    export type Provider = { 
        classifier: Classifier.Provider,
        provide: ProviderFunc, 
        args: OpArgs 
    }

    /*
     * Sequencers are a list of operations to be performed sequentially (including other sequencers)
     */
    export type Sequencer = {
        classifier: Classifier.Sequence,
        operations: Operation.Any[]
    } 

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
        return { classifier: Classifier.Sequence, operations }
    }

    export let SequenceStrict = (...operations: (Operation.Any)[]): Provider => {
        return Provide(() => Sequence(...operations), { strict: true })
    }

    export let None = Sequence()

    export function applyIf(condition: boolean, operation: Operation.Any): Operation.Any {
        return condition ? operation :Operation.None;
    }

}
