import CoreState from "../core/definitions/CoreState"
import CoreResult from "../core/definitions/CoreResult"
import GameSchema from "../schema/definitions/GameSchema"

interface StateMapper<S, R, T> {
    mapFromResult: (previousState: T, result: R, schema: GameSchema) => T
    initialize: (state: S, schema: GameSchema) => T
}

namespace StateMapper {

    // Just passes the core state through rather than mapping to a different state
    export const coreDefault: StateMapper<CoreState, CoreResult, { core: CoreState }> = {
        mapFromResult: state => state,
        initialize: core => { return { core } }
    }

}

export default StateMapper