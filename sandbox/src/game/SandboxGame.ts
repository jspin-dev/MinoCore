import type CoreState from "../../../build/core/definitions/CoreState"
import type MinoGame from "../../../build/core/MinoGame"
import updateStatistics from "../../../build/addons/coreStatistics/coreStatsAddon"
import type CoreResult from "../../../build/core/definitions/CoreResult"
import Statistics from "../../../build/addons/definitions/CoreStatistics"
import type PreviewGridState from "../../../build/addons/definitions/GridState"
import type Settings from "../../../build/settings/definitions/Settings"
import tetroSchemas from "../../../build/presets/tetro/tetroSchemaPresets"
import CoreOperations from "../../../build/core/definitions/CoreOperations"

namespace SandboxGame {

    export const config = (initialSettings: Settings) => {
        return {
            initialSettings,
            schema: tetroSchemas.guideline,
            operations: CoreOperations.defaults,
            stateMapper: {
                mapFromResult: (previousState: SandboxGame.State, result: CoreResult) => {
                    const statistics = updateStatistics(previousState.statistics, result.events)
                    return { core: result.state, statistics, previewGrids: null }
                },
                initialize: (core: CoreState) => {
                    return { core, statistics: Statistics.initial, previewGrids: null }
                }
            }
        } satisfies MinoGame.Config<SandboxGame.State>
    }

    export interface State {
        core: CoreState
        statistics: Statistics
        previewGrids: PreviewGridState
    }

}

export default SandboxGame