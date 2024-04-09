import CoreState from "../../../build/core/definitions/CoreState"
import Statistics from "../../../build/addons/definitions/GuidelineStatistics"
import type PreviewGridState from "../../../build/addons/definitions/GridState"
import type Settings from "../../../build/settings/definitions/Settings"
import type CoreDependencies from "../../../build/core/definitions/CoreDependencies"

interface SandboxGameState {
    core: CoreState
    statistics: Statistics
    previewGrids: PreviewGridState
}

namespace SandboxGameState {

    export const initial = (initialSettings: Settings, dependencies: CoreDependencies) => {
        return {
            core: CoreState.initial(initialSettings, dependencies.schema),
            statistics: Statistics.initial,
            previewGrids: null
        }
    }

}

export default SandboxGameState