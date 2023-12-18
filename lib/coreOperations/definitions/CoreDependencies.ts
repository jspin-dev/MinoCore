import Settings from "./Settings"
import CoreState from "./CoreState"
import CoreOperations from "./CoreOperations"
import OperationResult from "./CoreOperationResult"
import GameSchema from "../../schemas/definitions/GameSchema"

export default interface CoreDependencies {
    operations: CoreOperations<CoreState, CoreDependencies, OperationResult<CoreState>>
    schema: GameSchema,
    defaultSettings: Settings
}
