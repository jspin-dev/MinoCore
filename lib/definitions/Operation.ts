import { produce, type Draft } from "immer";

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

}

namespace Operation {

    /**
     * Draft provides a draft state which can be safely mutated. See https://github.com/immerjs/immer for more info
     * Logic here should be limited to only what is necessary to make the needed state changes. However, care should still
     * be taken with regards to performance (see https://immerjs.github.io/immer/performance)
     */
    export function Draft<S>(draft: (draft: Draft<S>) => void): Drafter<S> {
        return { 
            classifier: Classifier.Drafter, 
            applyIf: (condition) => { return  Draft(condition ? draft : () => {}) },
            execute: state => produce(state, draft)
        }
    }

    /**
     * Resolve operations form more complex logic by chaining together Drafters and other Resolvers.
     * They have access to a read-only copy of the state and return some other operation. To modify the state, use Draft instead 
     */
    export function Resolve<S, D>(resolve: (state: S, dependencies: D) => Operation<S, D>): Resolver<S, D> {
        return { 
            classifier: Classifier.Resolver, 
            applyIf: (condition) => { return condition ? Resolve(resolve) : Operation.None() },
            execute: (state, dependencies) => executeOperation(state, dependencies, resolve(state, dependencies))
        }
    }

    /**
     * Sequence pesudo operation (technically it is a Resolver) which is composed of operations meant to be performed sequentally 
     */
    export function Sequence<S, D>(...operations: Operation<S, D>[]): Resolver<S, D> {
        return { 
            classifier: Classifier.Resolver, 
            applyIf: (condition) => { return condition ? Sequence(...operations) : Operation.None() },
            execute: (state, dependencies) => {
                return operations.reduce((current, operation) => executeOperation(current, dependencies, operation), state); 
            }
        }
    }

    export let None = <S, D>() => Sequence<S, D>()

    let executeOperation = <S, D>(state: S, depencencies: D, operation: Operation<S, D>): S => {
        switch (operation.classifier) {
            case Operation.Classifier.Resolver:
                return operation.execute(state, depencencies);
            case Operation.Classifier.Drafter:
                return operation.execute(state);
        }
    }

}

export default Operation