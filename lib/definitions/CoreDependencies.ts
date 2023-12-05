import { Settings } from "./settingsDefinitions"
import CoreState from "./CoreState"
import CoreOperations from "./CoreOperations"
import { OperationResult } from "./OperationResult"

export default interface CoreDependencies {
    operations: CoreOperations<CoreState, CoreDependencies, OperationResult<CoreState>>
    defaultSettings: Settings
}
