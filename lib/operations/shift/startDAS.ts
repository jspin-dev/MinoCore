import Operation from "../../definitions/CoreOperation"
import { SideEffectRequest, TimerName, TimerOperation } from "../../definitions/metaDefinitions"

let mainProvider = Operation.Provide(({ state }, { operations }) => {
    let startDasTimer = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffectRequest.TimerOperation(TimerName.DAS, TimerOperation.Start))
    })
    return state.settings.das === 0 ? operations.startAutoShift : startDasTimer;
}, {
    description: "Start shifting if DAS is 0, otherwise start DAS"
})

let conditionalPreIntervalShift = Operation.Provide(({ state }, { operations }) => {
    return Operation.applyIf(state.settings.dasPreIntervalShift, operations.shift(1))
})

export default Operation.requireActiveGame(
    Operation.Sequence(
        conditionalPreIntervalShift,
        Operation.Provide((_, { operations }) => operations.cancelAutoShift),
        mainProvider
    )
)