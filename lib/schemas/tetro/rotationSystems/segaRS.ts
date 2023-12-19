import Orientation from "../../../definitions/Orientation";
import RotationSystem from "../../definitions/RotationSystem";
import TetroPiece from "../TetroPiece";
import RotationProviderPresets from "../../providerPresets/rotationProviders";

let rotationSystem: RotationSystem = {
    featureProvider: RotationProviderPresets.basic(),
    offsets: { 
        [TetroPiece.O]: RotationSystem.BoundingBoxOffsets.None,
        [TetroPiece.T]: RotationSystem.BoundingBoxOffsets.None,
        [TetroPiece.J]: {
            [Orientation.North]: [0, 1],
            [Orientation.East]: [0, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [0, 0]
        },
        [TetroPiece.L]: {
            [Orientation.North]: [0, 1],
            [Orientation.East]: [0, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [0, 0]
        },
        [TetroPiece.S]: {
            [Orientation.North]: [0, 1],
            [Orientation.East]: [-1, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [0, 0]
        },
        [TetroPiece.Z]: {
            [Orientation.North]: [0, 1],
            [Orientation.East]: [0, 0],
            [Orientation.South]: [0, 0],
            [Orientation.West]: [1, 0]
        },
        [TetroPiece.I]: {
            [Orientation.North]: [0, 0],
            [Orientation.East]: [0, 0],
            [Orientation.South]: [0, -1],
            [Orientation.West]: [1, 0]
        }
    }
}

export default rotationSystem;