import Operation from "../../definitions/CoreOperation"
import SideEffect from "../../definitions/SideEffect";

let resolveMovement = Operation.Resolve(({ state }, { operations }) => {
    let draftTimerChange = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerOperation(SideEffect.TimerName.DAS, SideEffect.TimerOperation.Start))
    })
    return state.settings.das === 0 ? operations.startAutoShift : draftTimerChange;
})

let resolvePreIntervalShift = Operation.Resolve(({ state }, { operations }) => {
    return operations.shift(1).applyIf(state.settings.dasPreIntervalShift)
})

export default Operation.Util.requireActiveGame(
    Operation.Sequence(
        resolvePreIntervalShift,
        Operation.Resolve((_, { operations }) => operations.cancelAutoShift),
        resolveMovement
    )
)