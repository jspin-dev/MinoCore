import Orientation from "../../../definitions/Orientation";
import RotationSystem from "../../definitions/RotationSystem";
import TetroPiece from "../TetroPiece";
import RotationProviderPresets from "../../providerPresets/rotationProviders";
import RotationValidatorPresets from "../../providerPresets/rotationValidators";
import KickTable from "../../definitions/KickTable";

let defaultTable: KickTable = {
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

let iTable: KickTable = {
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

let kickTables: KickTable.Map = { 
    [TetroPiece.J]: defaultTable,
    [TetroPiece.L]: defaultTable,
    [TetroPiece.S]: defaultTable,
    [TetroPiece.Z]: defaultTable,
    [TetroPiece.T]: defaultTable,
    [TetroPiece.O]: defaultTable,
    [TetroPiece.I]: iTable
}

let defaultOffsets = RotationSystem.BoundingBoxOffsets.None;

let rotationSystem: RotationSystem = {
    featureProvider: RotationProviderPresets.kickTable(kickTables, RotationValidatorPresets.simpleCollision),
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

export default rotationSystem