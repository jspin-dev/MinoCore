import LockdownStatus from "../../definitions/LockdownStatus"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreResult from "../../definitions/CoreResult"
import CoreDependencies from "../../definitions/CoreDependencies"
import { updateState } from "../../utils/coreReducerUtils"
import { mapReducer, withCondition, sequence, withPreconditions } from "../../../util/reducerUtils"

const conditionalLock = mapReducer((previousResult: CoreResult, { reducers }: CoreDependencies) => {
    return withCondition(reducers.lock, previousResult.state.activePiece.availableDropDistance == 0)
})

const rootReducer = sequence(updateState({ lockdownStatus: LockdownStatus.Triggered }), conditionalLock)

// noinspection JSUnusedGlobalSymbols
export default withPreconditions({
    reducerName: "triggerLockdown",
    reduce: rootReducer,
    preconditions: [ CorePreconditions.activeGame, CorePreconditions.activePiece ]
})
