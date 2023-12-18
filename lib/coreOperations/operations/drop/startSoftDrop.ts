import Operation from "../../definitions/CoreOperation";
import PendingMovement from "../../definitions/PendingMovement";
import SideEffect from "../../definitions/SideEffect";

export default Operation.Util.requireActiveGame(
    Operation.Resolve((_, { operations }) => Operation.Sequence(
        Operation.Draft(({ state }) => { state.pendingMovement = PendingMovement.SoftDrop(0) }),
        operations.drop(1), 
        Operation.Draft(({ state }) => { state.softDropActive = true }),
        resolveDrop
    ))
)

let resolveDrop = Operation.Resolve(({ state }, { operations, schema }) => {
    let autoDrop = Operation.Draft(({ state, sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.TimerInterval(SideEffect.TimerName.AutoDrop, state.settings.softDropInterval))
    })
    return state.settings.softDropInterval == 0 ? operations.drop(state.activePiece.distanceToFloor) : autoDrop;
})