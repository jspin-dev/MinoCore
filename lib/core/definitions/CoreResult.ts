import CoreOperationResult from "./CoreOperationResult"
import CoreState from "./CoreState"
import Settings from "../../settings/definitions/Settings";
import GameSchema from "../../schema/definitions/GameSchema";

type CoreResult = Readonly<CoreOperationResult<CoreState>>

namespace CoreResult {

    export const initial = (settings: Settings, schema: GameSchema, randomNumbers: number[]) => {
        return initFromCoreState(CoreState.initial(settings, schema, randomNumbers))
    }

    export const initFromCoreState = (state: CoreState): CoreResult => {
        return {
            state,
            deferredActions: [],
            events: [],
            logs: []
        }
    }

}

export default CoreResult