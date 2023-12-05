import GameEvent from "./definitions/GameEvent";
import Operation from "./definitions/Operation";
import { SideEffectRequest } from "./definitions/metaDefinitions";
import CoreState from "./definitions/CoreState";
import { Statistics } from "./definitions/Statistics";
import { updateStatistics } from "./guidelineStatistics";
import CoreDependencies from "./definitions/CoreDependencies";
import { CoreOperationResult as OperationResult } from "./definitions/CoreOperationResult";

export interface OverallState<S extends CoreState, T extends Statistics> {

    core: S
    statistics: T

}

export interface OverallResult<S extends CoreState, T extends Statistics> {

    state: OverallState<S, T>,
    sideEffectRequests: SideEffectRequest.Any[],
    events: GameEvent[]

}

export let executeStats = <S extends CoreState, T extends Statistics, D extends CoreDependencies>(
    state: OverallState<S, T> | null,
    initialState: OverallState<S, T>,
    depencencies: D,
    rootOperation: Operation<OperationResult<S>, D>
): OperationResult<OverallState<S, T>> => {
    let initialResult: OperationResult<S> = {
        state: state?.core || initialState.core,
        sideEffectRequests: [],
        events: []
    }
    let coreResult = rootOperation.execute(initialResult, depencencies);
    let statsOperation = updateStatistics(coreResult) as Operation<T, void>
    let statistics = statsOperation.execute(state?.statistics ?? initialState.statistics)
    return { 
        state: { core: coreResult.state, statistics },
        sideEffectRequests: coreResult.sideEffectRequests,
        events: coreResult.events
    }
}
