import Settings from "./Settings"
import CoreState from "./CoreState"
import CoreOperations from "./CoreOperations"
import OperationResult from "./CoreOperationResult"
import GameSchema from "./GameSchema"

export default interface CoreDependencies {
    operations: CoreOperations<CoreState, CoreDependencies, OperationResult<CoreState>>
    schema: GameSchema,
    defaultSettings: Settings
}
