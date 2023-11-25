import Operation from "../../definitions/Operation"
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions"

export default (softDropInterval: number) => Operation.Sequence(
    Operation.Draft(draft => { draft.settings.softDropInterval = softDropInterval }),
    conditionallyRequestTimerChange
)

let conditionallyRequestTimerChange = Operation.Provide(({ meta, settings }) => {
    return Operation.applyIf(
        meta.softDropActive,
        Operation.Request(SideEffectRequest.TimerInterval(TimerName.AutoDrop, settings.softDropInterval))
    )
})