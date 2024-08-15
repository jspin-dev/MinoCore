import type CoreState from "../../../build/core/definitions/CoreState"
import type MinoGame from "../../../build/core/MinoGame"
import updateStatistics from "../../../build/addons/guidelineStatistics/guidelineStatsAddon"
import type CoreResult from "../../../build/core/definitions/CoreResult"
import type Settings from "../../../build/settings/definitions/Settings"
import tetroSchemas from "../../../build/presets/tetro/tetroSchemaPresets"
import CoreOperations from "../../../build/core/definitions/CoreOperations"
import updatePreviewGrids from "../../../build/addons/gridBuilder/gridBuilderAddon"
import type GameSchema from "../../../build/schema/definitions/GameSchema"
import { GridBuilderState } from "../../../build/addons/gridBuilder/definitions/GridBuilderState"
import GuidelineStatistics from "../../../build/addons/definitions/GuidelineStatistics"

namespace SandboxGame {

    const stateMapper = {
        mapFromResult: (previousState: SandboxGame.State, result: CoreResult, schema: GameSchema) => {
            const statistics = updateStatistics(previousState.statistics, result.events)
            const grids = updatePreviewGrids(previousState.grids, result.state, schema)
            return { core: result.state, statistics, grids }
        },
        initialize: (core: CoreState, schema: GameSchema) => {
            return {
                core,
                statistics: GuidelineStatistics.initial,
                grids: GridBuilderState.initial(core, schema)
            }
        }
    }

    export const config = (initialSettings: Settings) => {
        return {
            initialSettings,
            schemaBasis: tetroSchemas.guideline,
            operations: CoreOperations.defaults,
            stateMapper
        } satisfies MinoGame.Config<SandboxGame.State>
    }

    export interface State {
        core: CoreState
        statistics: GuidelineStatistics
        grids: GridBuilderState
    }

}

export default SandboxGame