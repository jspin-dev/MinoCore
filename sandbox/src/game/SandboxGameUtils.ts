namespace SandboxGameUtils {

    // export const run = (
    //     rootOperation: Operation<OperationResult<CoreState>, CoreDependencies>,
    //     state: SandboxGameState,
    //     dependencies: CoreDependencies
    // ) => {
    //     const coreResult = CoreOperation.execute(rootOperation, state.core, dependencies)
    //     const statsOperation = updateStatistics(coreResult.events) as Operation<Statistics, void>
    //     const statistics = statsOperation.execute(state.statistics)
    //     // let previewGridsOperation = syncPreviewGrids(coreResult) as PreviewGridOperation
    //     // let previewGrids = previewGridsOperation.execute(this.state?.previewGrids ?? PreviewGridState.initial)
    //     return {
    //         resultState: { core: coreResult.state, statistics, previewGrids: null },
    //         sideEffectRequests: coreResult.sideEffectRequests
    //     }
    // }

    export const generateRns = (quantity: number) => {
        return Array.from(Array(quantity)).map(() => Math.random())
    }

}

export default SandboxGameUtils