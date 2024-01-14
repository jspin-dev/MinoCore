import Operation from "../../definitions/CoreOperation"
import GameEvent from "../../../definitions/GameEvent"
import SideEffectRequest from "../../definitions/SideEffectRequest"

const rootOperation = Operation.Resolve(({ state }, { schema }) => {
    const { pieces, rns } = schema.pieceGenerator.refill({ pieces: state.previewQueue, rns: state.randomNumbers })
    const rnsDeficit = state.randomNumbers.length - rns.length
    return Operation.Draft(({ state, events, sideEffectRequests }) => {
        state.previewQueue = pieces
        state.randomNumbers = rns
        events.push(GameEvent.Enqueue({ preview: state.previewQueue }))
        sideEffectRequests.push(SideEffectRequest.Rng({ quantity: rnsDeficit }))
    })
})

export default Operation.Export({ operationName: "refillQueue", rootOperation })