import CoreResult from "../definitions/CoreResult"
import CoreDependencies from "../definitions/CoreDependencies"
import GameEvent from "../../definitions/GameEvent"
import DeferredAction from "../definitions/DeferredAction"

export default (initialResult: CoreResult, { schema, operations }: CoreDependencies) => {
    const { state, events, deferredActions } = initialResult
    const { pieces, rns } = schema.pieceGenerator.refill({
        pieces: state.previewQueue,
        rns: state.randomNumbers
    })
    const rnsDeficit = state.randomNumbers.length - rns.length
    const deferredAction = DeferredAction.AddRns({ operation: operations.addRns, quantity: rnsDeficit })
    return {
        state: { ...state, previewQueue: pieces, randomNumbers: rns },
        events: [...events, GameEvent.Enqueue({ preview: state.previewQueue })],
        deferredActions: [...deferredActions, deferredAction]
    }
}
