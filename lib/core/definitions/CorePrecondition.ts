import Precondition from "../../definitions/Precondition"
import CoreReducerResult from "./CoreReducerResult"
import CoreState from "./CoreState"

type CorePrecondition = Precondition<CoreReducerResult<CoreState>>
export default CorePrecondition