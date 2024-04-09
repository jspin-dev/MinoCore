import CorePreconditions from "../../utils/CorePreconditions"
import CoreDependencies from "../../definitions/CoreDependencies"
import CoreState from "../../definitions/CoreState"
import { withPreconditions } from "../../../util/reducerUtils"
import { createStateReducer } from "../../utils/coreReducerUtils"

const rootReducer = createStateReducer((state: CoreState, { schema }: CoreDependencies) => {
    const { playfield, ghostCoordinates } = schema.ghostProvider.refresh(state)
    return { activePiece: { ...state.activePiece, ghostCoordinates }, playfield }
})

export default withPreconditions({
    reducerName: "refreshGhost",
    reduce: rootReducer,
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})
