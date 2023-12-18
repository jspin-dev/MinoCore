import Operation from "../../definitions/CoreOperation"
import GameEvent from "../../definitions/GameEvent";
import PieceIdentifier from "../../../definitions/PieceIdentifier";
import SideEffect from "../../definitions/SideEffect";

export default Operation.Resolve(({ state }, dependencies) => {
    let { operations, schema } = dependencies;
    let generationResult = schema.pieceGenerator.generateToFill(state, dependencies);
    let rnCount = generationResult.randomNumbersUsed.length;

    let addRnsRequest = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.Rng(rnCount))
    })

    return Operation.Sequence(            
        enqueue(...generationResult.newPieces),
        rnCount > 0 ? operations.removeRns(rnCount) : Operation.None,
        addRnsRequest
    )   
})

let enqueue = (...pieces: PieceIdentifier[]) => Operation.Draft(({ state, events }) => { 
    state.previewQueue.push(...pieces);
    events.push(GameEvent.Enqueue(pieces, state.previewQueue)) ;
})
