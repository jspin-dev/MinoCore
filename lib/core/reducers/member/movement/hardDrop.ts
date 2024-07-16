import DropType from "../../../../definitions/DropType"
import CorePreconditions from "../../../utils/CorePreconditions"
import CoreResult from "../../../definitions/CoreResult"
import CoreDependencies from "../../../definitions/CoreDependencies"
import { mapReducer, sequence, withPreconditions } from "../../../../util/reducerUtils"

const rootReducer = mapReducer(({ state }: CoreResult, { reducers }: CoreDependencies) => sequence(
    reducers.drop(DropType.Hard, state.activePiece.availableDropDistance),
    reducers.lock
))

export default withPreconditions({
    reducerName: "hardDrop",
    reduce: rootReducer,
    preconditions: [CorePreconditions.activeGame, CorePreconditions.activePiece]
})