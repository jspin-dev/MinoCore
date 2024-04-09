import CorePreconditions from "../../../utils/CorePreconditions"
import CoreDependencies from "../../../definitions/CoreDependencies"
import CoreResult from "../../../definitions/CoreResult"
import { mapReducer, sequence, withPreconditions } from "../../../../util/reducerUtils"
import { updateState } from "../../../utils/coreReducerUtils"

const rootReducer = (rns: number[]) => mapReducer((_: CoreResult, { schema, reducers }: CoreDependencies) => {
    return sequence(
        updateState({ randomNumbers: rns }),
        schema.rotationSystem.initialize,
        reducers.refillQueue
    )
})

export default (rns: number[]) => withPreconditions({
    reducerName: "initialize",
    reduce: rootReducer(rns),
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})