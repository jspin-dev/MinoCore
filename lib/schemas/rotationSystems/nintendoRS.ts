import Orientation from "../../definitions/Orientation";
import RotationSystem from "../definitions/RotationSystem";
import TetroPiece from "../definitions/TetroPiece";
import RotationProviderPresets from "../presets/rotationProviders";

let iszOffsets: RotationSystem.BoundingBoxOffsets = {
    [Orientation.North]: [0, 1],
    [Orientation.East]: [0, 0],
    [Orientation.South]: [0, 0],
    [Orientation.West]: [1, 0]
}

let defaultOffsets = RotationSystem.BoundingBoxOffsets.None;

let rotationSystem: RotationSystem = {
    featureProvider: RotationProviderPresets.classic,
    offsets: { 
        [TetroPiece.J]: defaultOffsets,
        [TetroPiece.L]: defaultOffsets,
        [TetroPiece.T]: defaultOffsets,
        [TetroPiece.O]: defaultOffsets,
        [TetroPiece.I]: iszOffsets,
        [TetroPiece.S]: iszOffsets,
        [TetroPiece.Z]: iszOffsets
    }
}

export default rotationSystem;