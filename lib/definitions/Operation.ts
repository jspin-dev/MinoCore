import { type Draft } from "immer"
import { executeDrafter, executeResolver, executeSequence } from "../util/opExecutionUtils"

type Operation<S, D> = Operation.Drafter<S> | Operation.Resolver<S, D>

namespace Operation {

    export enum Classifier { Resolver, Drafter }

    export interface Drafter<S> { 
        classifier: Classifier.Drafter,
        applyIf: (condition: boolean) => Drafter<S>
        execute: (state: S) => S
    }

    export interface Resolver<S, D> { 
        classifier: Classifier.Resolver,
        applyIf: (condition: boolean) => Resolver<S, D>
        execute: (state: S, dependencies: D) => S
    }

    export interface Precondition<S> {
        isValid: (state: S) => boolean,
        rationale: string
    }

    export interface OptionalParams<S> {
        operationName: string,
        preconditions?: Precondition<S>[]
    }

}

namespace Operation {

    /**
     * Draft provides a draft state which can be safely mutated. See https://github.com/immerjs/immer for more info
     * Logic here should be limited to only what is necessary to make the needed state changes. However, care should still
     * be taken regarding performance (see https://immerjs.github.io/immer/performance)
     */
    export function Draft<S>(draft: (draft: Draft<S>) => void): Drafter<S> {
        return { 
            classifier: Classifier.Drafter, 
            applyIf: (condition) => { return  Draft(condition ? draft : () => {}) },
            execute: executeDrafter(draft)
        }
    }

    /**
     * Resolve operations form more complex logic by chaining together Drafters and other Resolvers.
     * They have access to a read-only copy of the state and return some other operation. To modify the state, use Draft instead 
     */
    export function Resolve<S, D>(
        resolve: (state: S, dependencies: D) => Operation<S, D>,
        optionalParams?: OptionalParams<S>
    ): Resolver<S, D> {
        return { 
            classifier: Classifier.Resolver, 
            applyIf: (condition) => { return condition ? Resolve(resolve) : Operation.None() },
            execute: executeResolver(resolve, optionalParams)
        }
    }

    /**
     * A pseudo operation (technically a Resolver) which takes in a list of operations to be performed sequentially
     */
    export function Sequence<S, D>(...operations: Operation<S, D>[]): Resolver<S, D> {
        return { 
            classifier: Classifier.Resolver, 
            applyIf: (condition) => { return condition ? Sequence(...operations) : Operation.None() },
            execute: executeSequence(operations)
        }
    }

}

// Convenience
namespace Operation {

    export namespace Export {

        export interface Params<S, D> extends OptionalParams<S> {
            rootOperation: Operation<S, D>
        }

    }

    export function Export <S, D>(params: Export.Params<S, D>): Operation<S, D> {
        return Resolve(() => params.rootOperation, params)
    }

    export let None = <S, D>() => Sequence<S, D>()

}

export default Operation