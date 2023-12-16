import Operation from "../../definitions/CoreOperation"
import SideEffect from "../../definitions/SideEffect";

let mainProvider = Operation.Provide(({ state }, { operations }) => {
    let startDasTimer = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.DAS, SideEffect.TimerOperation.Start))
    })
    return state.settings.das === 0 ? operations.startAutoShift : startDasTimer;
})

let conditionalPreIntervalShift = Operation.Provide(({ state }, { operations }) => {
    return operations.shift(1).applyIf(state.settings.dasPreIntervalShift)
})

export default Operation.Util.requireActiveGame(
    Operation.Sequence(
        conditionalPreIntervalShift,
        Operation.Provide((_, { operations }) => operations.cancelAutoShift),
        mainProvider
    )
)