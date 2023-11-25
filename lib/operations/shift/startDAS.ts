import Operation from "../../definitions/Operation"
import { TimerName, TimerOperation } from "../../definitions/metaDefinitions"
import shift from "./shift"
import startAutoShift from "./startAutoShift"
import cancelAutoShift from "./cancelAutoShift"

let mainProvider = Operation.Provide(({ settings }) => {
    let startDasTimer = Operation.RequestTimerOp(TimerName.DAS, TimerOperation.Start);
    return settings.das === 0 ? startAutoShift : startDasTimer;
}, {
    description: "Start shifting if DAS is 0, otherwise start DAS"
})

let conditionalPreIntervalShift = Operation.Provide(({ settings }) => {
    return Operation.applyIf(settings.dasPreIntervalShift, shift(1))
})

export default Operation.SequenceStrict(
    conditionalPreIntervalShift,
    cancelAutoShift,
    mainProvider
)
