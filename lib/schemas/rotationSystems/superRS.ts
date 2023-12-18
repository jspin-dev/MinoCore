import KickTableSchema from "../definitions/KickTableSchema";
import Orientation from "../../definitions/Orientation";
import RotationSystem from "../definitions/RotationSystem";
import TetroPiece from "../definitions/TetroPiece";
import RotationProviderPresets from "../presets/rotationProviders";
import RotationValidatorPresets from "../presets/rotationValidators";

let defaultTable: KickTableSchema.Table = {
    [Orientation.North]: {
        [Orientation.North]: [],
        [Orientation.East]: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        [Orientation.South]: [[0, 0], [0, -1]],
        [Orientation.West]: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
    },
    [Orientation.East]: {
        [Orientation.North]: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        [Orientation.East]: [],
        [Orientation.South]: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]],
        [Orientation.West]: [[0, 0], [1, 0]]
    },
    [Orientation.South]: {
        [Orientation.North]: [[0, 0], [0, 1]],
        [Orientation.East]: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]],
        [Orientation.South]: [],
        [Orientation.West]: [[0, 0], [-1, 0], [1, -1], [0, 2], [1, 2]]
    },
    [Orientation.West]: {
        [Orientation.North]: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        [Orientation.East]: [[0, 0], [-1, 0]],
        [Orientation.South]: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]],
        [Orientation.West]: []
    }
}

let iTable: KickTableSchema.Table = {
    [Orientation.North]: {
        [Orientation.North]: [],
        [Orientation.East]: [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
        [Orientation.South]: [[0, 0], [0, -1]],
        [Orientation.West]: [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]
    },
    [Orientation.East]: {
        [Orientation.North]: [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]],
        [Orientation.East]: [],
        [Orientation.South]: [[0, 0], [-1, 0], [2, 0], [1, -2], [-2, 1]],
        [Orientation.West]: [[0, 0], [1, 0]]
    },
    [Orientation.South]: {
        [Orientation.North]: [[0, 0], [0, 1]],
        [Orientation.East]: [[0, 0], [1, 0], [-2, 0], [-1, 2], [2, -1]],
        [Orientation.South]: [],
        [Orientation.West]: [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]]
    },
    [Orientation.West]: {
        [Orientation.North]: [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]],
        [Orientation.East]: [[0, 0], [-1, 0]],
        [Orientation.South]: [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]],
        [Orientation.West]: []
    }
}

let schema: KickTableSchema = {
    rotationValidator: RotationValidatorPresets.simpleCollision, 
    tables: { 
        [TetroPiece.J]: defaultTable,
        [TetroPiece.L]: defaultTable,
        [TetroPiece.S]: defaultTable,
        [TetroPiece.Z]: defaultTable,
        [TetroPiece.T]: defaultTable,
        [TetroPiece.O]: defaultTable,
        [TetroPiece.I]: iTable
    }
}

let defaultOffsets = RotationSystem.BoundingBoxOffsets.None;

let rotationSystem: RotationSystem = {
    featureProvider: RotationProviderPresets.kickTable(schema),
    offsets: { 
        [TetroPiece.J]: defaultOffsets,
        [TetroPiece.L]: defaultOffsets,
        [TetroPiece.T]: defaultOffsets,
        [TetroPiece.O]: defaultOffsets,
        [TetroPiece.I]: defaultOffsets,
        [TetroPiece.S]: defaultOffsets,
        [TetroPiece.Z]: defaultOffsets
    }
}

export default rotationSystem;