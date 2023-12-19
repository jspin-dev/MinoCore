import { WritableDraft } from "immer/dist/internal"
import Operation from "../../definitions/CoreOperation"
import Settings from "../../definitions/Settings"
import { createEmptyGrid } from "../../../util/sharedUtils"
import validateRotationSettings from "../rotation/validateRotationSettings"
import SideEffect from "../../definitions/SideEffect"
import Cell from "../../../definitions/Cell"

export default Operation.Resolve((_, { defaultSettings, schema }) => {
    let draftRnsRequest = Operation.Draft(({ sideEffectRequests }) => {
        sideEffectRequests.push(SideEffect.Request.Rng(Object.values(schema.pieces).length - 1))
    })
    let draftStateInitialization = Operation.Draft(({ state }) => {
        state.playfieldGrid = createEmptyGrid(schema.playfield.rows, schema.playfield.columns, Cell.Empty);
        state.settings = defaultSettings as WritableDraft<Settings>;
    })
    return Operation.Sequence(draftStateInitialization, validateRotationSettings, draftRnsRequest)    
})
