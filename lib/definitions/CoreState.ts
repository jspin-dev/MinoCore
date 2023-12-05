import { Settings } from "./settingsDefinitions"
import { Hold, Meta, Playfield, Preview } from "./stateTypes"

type CoreState = {
    playfield: Playfield,
    hold: Hold,
    preview: Preview,
    meta: Meta,
    settings: Settings
}

namespace CoreState {

    export let initial: CoreState = {
        playfield: null,
        hold: null,
        preview: null,
        meta: null,
        settings: null
    }

}

export default CoreState;