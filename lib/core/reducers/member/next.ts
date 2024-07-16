import GameEvent from "../../../definitions/GameEvent"
import CorePreconditions from "../../utils/CorePreconditions"
import CoreDependencies from "../../definitions/CoreDependencies"
import CoreResult from "../../definitions/CoreResult"
import { mapReducer, sequence, withPreconditions } from "../../../util/reducerUtils"
import { addEvent, updateState } from "../../utils/coreReducerUtils"

const rootReducer = mapReducer((result: CoreResult, { reducers }: CoreDependencies) => {
    const dequeuedPiece = result.state.previewQueue.at(0)
    const updatedQueue =  result.state.previewQueue.slice(1)
    return sequence(
        updateState({ previewQueue: updatedQueue }),
        addEvent(GameEvent.Dequeue({ dequeuedPiece, preview: updatedQueue })),
        reducers.refillQueue,
        reducers.spawn(dequeuedPiece)
    )
})

export default withPreconditions({
    reducerName: "next",
    reduce: rootReducer,
    preconditions: [CorePreconditions.activeGame]
})
