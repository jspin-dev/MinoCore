import Input from "../../../build/definitions/Input";

export let presets = {
  default: {
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
      },
      das: 130,
      arr: 10,
      sdf: 15,
      ghostEnabled: true,
      dasPreservationEnabled: true,
      dasInteruptionEnabled: true,
      showGrid: true,
      showFocusBanner: true
  },
  alternate: {
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
      },
      das: 83,
      arr: 0,
      sdf: 0,
      ghostEnabled: true,
      dasPreservationEnabled: true,
      dasInteruptionEnabled: true,
      showGrid: false,
      showFocusBanner: false
  }

}