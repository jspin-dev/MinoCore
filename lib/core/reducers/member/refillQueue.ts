import CoreResult from "../../definitions/CoreResult"
import CoreDependencies from "../../definitions/CoreDependencies"
import GameEvent from "../../../definitions/GameEvent"
import SideEffectRequest from "../../definitions/SideEffectRequest"

export default (initialResult: CoreResult, { schema }: CoreDependencies) => {
    const { state, events, sideEffectRequests } = initialResult
    const { pieces, rns } = schema.pieceGenerator.refill({
        pieces: state.previewQueue,
        rns: state.randomNumbers
    })
    const rnsDeficit = state.randomNumbers.length - rns.length
    return {
        state: { ...state, previewQueue: pieces, randomNumbers: rns },
        events: [ ...events, GameEvent.Enqueue({ preview: state.previewQueue }) ],
        sideEffectRequests: [ ...sideEffectRequests, SideEffectRequest.Rng({ quantity: rnsDeficit }) ]
    }
}
