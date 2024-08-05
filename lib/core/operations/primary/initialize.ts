import CorePreconditions from "../../utils/CorePreconditions"
import { withPreconditions } from "../../../util/operationUtils"
import { mapFromOperations } from "../../utils/coreOperationUtils"

// noinspection JSUnusedGlobalSymbols
export default withPreconditions({
    operationName: "initialize",
    operation: mapFromOperations(operations  => operations.refillQueue),
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})
