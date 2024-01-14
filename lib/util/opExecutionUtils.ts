import Operation from "../definitions/Operation"
import { Draft, produce } from "immer"

const debugMode = false

export const executeDrafter = <S>(draft: (draft: Draft<S>) => void) => (state: S) => produce(state, draft)

export const executeResolver = <S, D>(
    resolve: (state: S, dependencies: D) => Operation<S, D>,
    optionalParams?: Operation.OptionalParams<S>
) => {
    return ((state, dependencies) => {
        const operationName = optionalParams?.operationName
        if (debugMode && operationName) {
            console.log(`Executing ${operationName}`)
            console.log(state)
        }
        const shouldProduceState = checkPreconditions(operationName, state, optionalParams?.preconditions ?? [])
        return shouldProduceState ? resolve(state, dependencies).execute(state, dependencies) : state
    }) satisfies (state: S, dependencies: D) => S
}

export const executeSequence = <S, D>(operations: Operation<S, D>[]) => {
    return (state: S, dependencies: D) => {
        return operations.reduce((current, operation) => executeOperation(current, dependencies, operation), state)
    }
}

const executeOperation = <S, D>(state: S, dependencies: D, operation: Operation<S, D>) => {
    switch (operation.classifier) {
        case Operation.Classifier.Resolver:
            return operation.execute(state, dependencies) satisfies S
        case Operation.Classifier.Drafter:
            return operation.execute(state) satisfies S
    }
}

const checkPreconditions = <S>(operationName: string | null, state: S, preconditions: Operation.Precondition<S>[]) => {
    const initialErrors: string[] =  []
    const errors = preconditions.reduce((accum, precondition) => {
        if (!precondition.isValid(state)) {
            return[...accum, `Precondition for exported operation ${operationName ?? "-"} failed: ${precondition.rationale}`]
        } else {
            return accum
        }
    }, initialErrors)

    errors.forEach(error => console.error(error))
    return errors.length == 0
}
