import type CoreState from "./CoreState"
import type CoreReducerResult from "./CoreReducerResult"
import type GameSchema from "../../schema/definitions/GameSchema"
import CoreReducers from "./CoreReducers"

export default interface CoreDependencies {
    reducers: CoreReducers<CoreState, CoreDependencies, CoreReducerResult<CoreState>>
    schema: GameSchema
}
