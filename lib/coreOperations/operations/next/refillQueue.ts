import Operation from "../../definitions/CoreOperation"
import GameEvent from "../../definitions/GameEvent";
import SideEffect from "../../definitions/SideEffect";

export default Operation.Resolve(({ state }, { schema }) => {
    let pieceDeficit = state.settings.nextPreviewSize - state.previewQueue.length
    if (pieceDeficit <= 0) {
        return Operation.None
    }
    let schemaPieces = Object.values(schema.pieces).map(p => p.id).sort()
    let { newPieces, updatedRns } = schema.pieceGenerator.generate(pieceDeficit, schemaPieces, state.randomNumbers)
    let rnsDeficit = state.randomNumbers.length - updatedRns.length
    let addRnsRequest = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.Rng(rnsDeficit))
    })
    let draftEnqueue = Operation.Draft(({ state, events }) => { 
        state.previewQueue.push(...newPieces)
        state.randomNumbers = updatedRns
        events.push(GameEvent.Enqueue(newPieces, state.previewQueue))
    })
    return Operation.Sequence(draftEnqueue, addRnsRequest)   
})
