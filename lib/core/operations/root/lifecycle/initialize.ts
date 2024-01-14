import type { WritableDraft } from "immer/dist/internal"
import Operation from "../../../definitions/CoreOperation"
import type Settings from "../../../definitions/Settings"
import Cell from "../../../../definitions/Cell"
import SideEffectRequest from "../../../definitions/SideEffectRequest"
import { createEmptyGrid } from "../../../../util/sharedUtils"

const rootOperation = Operation.Resolve((_, { defaultSettings, schema }) => {
    const draftRnsRequest = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffectRequest.Rng({ quantity: schema.pieceGenerator.rnsRequirement }))
    })
    const draftStateInitialization = Operation.Draft(({ state }) => {
        state.playfield = createEmptyGrid(schema.playfield.rows, schema.playfield.columns, Cell.Empty)
        state.settings = defaultSettings as WritableDraft<Settings>
    })
    return Operation.Sequence(draftStateInitialization, schema.rotationSystem.initialize, draftRnsRequest)
})

export default Operation.Export({ operationName: "initialize", rootOperation })
