import CoreReducerResult from "./CoreReducerResult"
import CoreState from "./CoreState"
import CoreDependencies from "./CoreDependencies"
import Reducer from "../../definitions/Reducer"

type CoreReducer = Reducer<CoreReducerResult<CoreState>, CoreDependencies>
export default CoreReducer