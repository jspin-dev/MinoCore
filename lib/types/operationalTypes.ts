import type { Draft } from "immer";
import { State } from "./stateTypes";

declare global {
    export enum OperationType {
        Default,
        ActiveGame,
        Lifecycle
    }
    
    /**
     * Drafters (called Recipes by immer) provide a draft state which can be safely mutated.
     * See https://github.com/immerjs/immer for more info
     * 
     * Logic here should be limited to only what is necessary to make the needed state changes. However, care should still
     * be given taken with regards to performance (see https://immerjs.github.io/immer/performance)
     * 
     * Note: Immer doesn't require a returned draft, but it's required here for more explicit type checking. Otherwise
     * many other function types can be mistaken for Drafters
     */
    export type Drafter = Loggable & {
        requiresActiveGame?: boolean,
        draft: (draft: DraftState) => void | DraftState
    }
    export type DraftState = Draft<State>
    
    /**
     * Providers form more complex logic by chaining together Drafters and other Providers.
     * They have access to a read-only copy of the state (to modify the state, use a Drafter instead) and can return 
     * a Drafter, Provider, or an array of Drafters/Providers to be executed sequentially
     */
    export type Provider = Loggable & {
        requiresActiveGame?: boolean,
        provide: (state: State) => Actionable
    }
    export type Operation = Drafter | Provider
    export type Actionable = Operation | Operation[]
    
    export type Loggable = {
        log?: string
    }
    
}

export {}