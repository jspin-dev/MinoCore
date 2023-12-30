import Operation from "../../definitions/CoreOperation"
import GameEvent from "../../../definitions/GameEvent"
import SideEffect from "../../definitions/SideEffect"

let rootOperation = Operation.Resolve(({ state }, { schema }) => {
    let { pieces, rns } = schema.pieceGenerator.refill(state.previewQueue, state.randomNumbers)
    let rnsDeficit = state.randomNumbers.length - rns.length
    return Operation.Draft(({ state, events, sideEffectRequests }) => {
        state.previewQueue = pieces
        state.randomNumbers = rns
        events.push(GameEvent.Enqueue(state.previewQueue))
        sideEffectRequests.push(SideEffect.Request.Rng(rnsDeficit))
    })
})

export default Operation.Export({ operationName: "refillQueue", rootOperation })