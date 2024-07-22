import CoreOperationResult from "./CoreOperationResult"
import CoreState from "./CoreState"
import CoreDependencies from "./CoreDependencies"
import Operation from "../../definitions/Operation"

type CoreOperation = Operation<CoreOperationResult<CoreState>, CoreDependencies>
export default CoreOperation