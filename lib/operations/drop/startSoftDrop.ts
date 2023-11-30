import Operation from "../../definitions/Operation";
import { MovementType } from "../../definitions/inputDefinitions";
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import recordStep from "../statistics/recordStep";

let autoOrInstantDrop = Operation.Provide(({ state }, { operations }) => {
    let autoDrop = Operation.Draft(({ state, sideEffectRequests }) => {
        sideEffectRequests.push(SideEffectRequest.TimerInterval(TimerName.AutoDrop, state.settings.softDropInterval))
    })
    return state.settings.softDropInterval == 0 ? operations.instantDrop(DropScoreType.Soft) : autoDrop;
})

let draftChanges = Operation.Draft(({ state }) => { 
    state.meta.softDropActive = true
    state.meta.activeRightShiftDistance = 0 
})

export default Operation.ProvideStrict((_, { operations }) => Operation.Sequence(
    operations.drop(1, DropScoreType.Soft), 
    recordStep(MovementType.Drop),
    draftChanges,
    autoOrInstantDrop
))
