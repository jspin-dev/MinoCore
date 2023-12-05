import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import { SideEffectRequest, TimerName } from "../../definitions/metaDefinitions";
import { DropScoreType } from "../../definitions/scoring/scoringDefinitions";
import { findInstantDropDistance } from "../../util/stateUtils";

export default Operation.Util.requireActiveGame(
    Operation.Provide((_, { operations }) => Operation.Sequence(
        Operation.Draft(({ state }) => { state.meta.pendingMovement = PendingMovement.SoftDrop(0) }),
        operations.drop(1, DropScoreType.Soft), 
        Operation.Draft(({ state }) => { state.meta.softDropActive = true }),
        autoOrInstantDrop
    ))
)

let autoOrInstantDrop = Operation.Provide(({ state }, { operations }) => {
    let autoDrop = Operation.Draft(({ state, sideEffectRequests }) => {
        sideEffectRequests.push(SideEffectRequest.TimerInterval(TimerName.AutoDrop, state.settings.softDropInterval))
    })
    return state.settings.softDropInterval == 0 ? operations.drop(findInstantDropDistance(state), DropScoreType.Soft) : autoDrop;
})

