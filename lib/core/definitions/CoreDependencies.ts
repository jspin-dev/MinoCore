import type CoreState from "./CoreState"
import type CoreOperationResult from "./CoreOperationResult"
import type GameSchema from "../../schema/definitions/GameSchema"
import CoreOperations from "./CoreOperations"

export default interface CoreDependencies {
    operations: CoreOperations<CoreState, CoreDependencies, CoreOperationResult<CoreState>>
    schema: GameSchema
}
