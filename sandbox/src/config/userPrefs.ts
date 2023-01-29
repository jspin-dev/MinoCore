import { Input } from "../../../build/definitions/inputDefinitions";
import { HandlingParam } from "../../../build/MinoGame";

export type HandlingPreferences = {
  [HandlingParam.ARR]: number,
  [HandlingParam.DAS]: number,
  [HandlingParam.SDF]: number
}

export type UserPreferences = {
  keybindings: { [key: string]: Input.Any },
  handling: HandlingPreferences
}

export let defaultPrefs: UserPreferences = {
    handling: {
      [HandlingParam.ARR]: 10,
      [HandlingParam.DAS]: 130,
      [HandlingParam.SDF]: 15
    },
    keybindings: {
        ArrowLeft: Input.ShiftLeft,
        ArrowRight: Input.ShiftRight,
        Space: Input.HD,
        KeyZ: Input.RotateCCW,
        ArrowUp: Input.RotateCW,
        KeyA: Input.Rotate180,
        ArrowDown: Input.SD,
        KeyC: Input.Hold,
        KeyP: Input.Pause,
        KeyR: Input.Restart
    }
}

export let alternatePrefs: UserPreferences = {
  handling: {
    [HandlingParam.ARR]: 0,
    [HandlingParam.DAS]: 83,
    [HandlingParam.SDF]: 0
  },
  keybindings: {
      ArrowLeft: Input.ShiftLeft,
      ArrowRight: Input.ShiftRight,
      Space: Input.HD,
      KeyA: Input.RotateCCW,
      KeyD: Input.RotateCW,
      KeyS: Input.Rotate180,
      ArrowDown: Input.SD,
      ShiftLeft: Input.Hold,
      KeyP: Input.Pause,
      KeyR: Input.Restart
  }
}