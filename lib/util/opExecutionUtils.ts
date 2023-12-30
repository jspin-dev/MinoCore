import Operation from "../definitions/Operation"
import { Draft, produce } from "immer"

let debugMode = false

export let executeDrafter = <S>(draft: (draft: Draft<S>) => void) => (state: S) => produce(state, draft)

export let executeResolver = <S, D>(
    resolve: (state: S, dependencies: D) => Operation<S, D>,
    optionalParams?: Operation.OptionalParams<S>
): (state: S, dependencies: D) => S => {
    return (state, dependencies) => {
        let operationName = optionalParams?.operationName
        if (debugMode && operationName) {
            console.log(`Executing ${operationName}`)
            console.log(state)
        }
        let shouldProduceState = checkPreconditions(operationName, state, optionalParams?.preconditions ?? [])
        return shouldProduceState ? resolve(state, dependencies).execute(state, dependencies) : state
    }
}

export let executeSequence = <S, D>(operations: Operation<S, D>[]) => {
    return (state: S, dependencies: D) => {
        return operations.reduce((current, operation) => executeOperation(current, dependencies, operation), state)
    }
}

let executeOperation = <S, D>(state: S, dependencies: D, operation: Operation<S, D>): S => {
    switch (operation.classifier) {
        case Operation.Classifier.Resolver:
            return operation.execute(state, dependencies)
        case Operation.Classifier.Drafter:
            return operation.execute(state)
    }
}

let checkPreconditions = <S>(operationName: string | null, state: S, preconditions: Operation.Precondition<S>[]): boolean => {
    let initialErrors: string[] =  []
    let errors = preconditions.reduce((accum, precondition) => {
        if (!precondition.isValid(state)) {
            return[...accum, `Precondition for exported operation ${operationName ?? "-"} failed: ${precondition.rationale}`]
        } else {
            return accum
        }
    }, initialErrors)

    errors.forEach(error => console.error(error))
    return errors.length == 0
}
