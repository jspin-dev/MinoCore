import { ActiveGameInput } from "../../build/definitions/metaDefinitions"
import { LifecycleInput } from "../../build/MinoGame"

export default {
    startingRow: 18,
    ceilingRow: 20,
    playfieldBlockSize: 30,
    previewBlockSize: 22,
    keybindings: {
        activeGame: {
            ArrowLeft: ActiveGameInput.ShiftLeft,
            ArrowRight: ActiveGameInput.ShiftRight,
            Space: ActiveGameInput.HD,
            KeyA: ActiveGameInput.RotateCCW,
            KeyD: ActiveGameInput.RotateCW,
            KeyS: ActiveGameInput.Rotate180,
            ArrowDown: ActiveGameInput.SD,
            ShiftLeft: ActiveGameInput.Hold
        },
        lifecycle: {
            KeyP: LifecycleInput.Pause,
            KeyR: LifecycleInput.Restart
        }
    },
    "blockColors": [
        "#000000",
        "#00FFFF",
        "#0000FF",
        "#FFAA00",
        "#FFFF00",
        "#00FF00",
        "#AA2288",
        "#FF0000"
    ]
}