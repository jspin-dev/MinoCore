import CorePreconditions from "../utils/CorePreconditions"
import CoreDependencies from "../definitions/CoreDependencies"
import CoreState from "../definitions/CoreState"
import { withPreconditions } from "../../util/operationUtils"
import { mapCoreState } from "../utils/coreOperationUtils"

const rootOperation = mapCoreState((state: CoreState, { schema }: CoreDependencies) => {
    const { playfield, ghostCoordinates } = schema.ghostProvider.refresh(state)
    return { activePiece: { ...state.activePiece, ghostCoordinates }, playfield }
})

export default withPreconditions({
    operationName: "refreshGhost",
    operation: rootOperation,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})
