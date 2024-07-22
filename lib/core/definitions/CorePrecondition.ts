import Precondition from "../../definitions/Precondition"
import CoreOperationResult from "./CoreOperationResult"
import CoreState from "./CoreState"

type CorePrecondition = Precondition<CoreOperationResult<CoreState>>
export default CorePrecondition