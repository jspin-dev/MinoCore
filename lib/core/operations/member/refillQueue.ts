import Operation from "../../definitions/CoreOperation"
import GameEvent from "../../../definitions/GameEvent"
import SideEffectRequest from "../../definitions/SideEffectRequest"

let rootOperation = Operation.Resolve(({ state }, { schema }) => {
    let { pieces, rns } = schema.pieceGenerator.refill({ pieces: state.previewQueue, rns: state.randomNumbers })
    let rnsDeficit = state.randomNumbers.length - rns.length
    return Operation.Draft(({ state, events, sideEffectRequests }) => {
        state.previewQueue = pieces
        state.randomNumbers = rns
        events.push(GameEvent.Enqueue({ preview: state.previewQueue }))
        sideEffectRequests.push(SideEffectRequest.Rng({ quantity: rnsDeficit }))
    })
})

export default Operation.Export({ operationName: "refillQueue", rootOperation })