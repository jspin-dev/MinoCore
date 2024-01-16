import Operation from "../../../definitions/CoreOperation"
import Cell from "../../../../definitions/Cell"
import SideEffectRequest from "../../../definitions/SideEffectRequest"
import { createEmptyGrid } from "../../../../util/sharedUtils"

const rootOperation = Operation.Resolve((_, { schema }) => {
    const draftRnsRequest = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffectRequest.Rng({ quantity: schema.pieceGenerator.rnsRequirement }))
    })
    const draftStateInitialization = Operation.Draft(({ state }) => {
        state.playfield = createEmptyGrid(schema.playfield.rows, schema.playfield.columns, Cell.Empty)
    })
    return Operation.Sequence(draftStateInitialization, schema.rotationSystem.initialize, draftRnsRequest)
})

export default Operation.Export({ operationName: "initialize", rootOperation })
