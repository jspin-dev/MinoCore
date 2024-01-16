import type CoreState from "./CoreState"
import type CoreOperations from "./CoreOperations"
import type OperationResult from "./CoreOperationResult"
import type GameSchema from "../../schema/definitions/GameSchema"

export default interface CoreDependencies {
    operations: CoreOperations<CoreState, CoreDependencies, OperationResult<CoreState>>
    schema: GameSchema
}
