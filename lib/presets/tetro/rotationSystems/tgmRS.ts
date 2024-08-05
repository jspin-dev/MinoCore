import Orientation from "../../../definitions/Orientation"
import RotationSystem from "../../../schema/rotation/definitions/RotationSystem"
import TetroPiece from "../TetroPiece"
import RotationMethods from "../../../schema/rotation/rotationMethods"
import { centralColumnValidator } from "../tetroRotationValidators"
import segaRS from "./segaRS"

const defaultKickOffsets = [[0, 0], [1, 0], [-1, 0]] satisfies RotationSystem.Offset[]

const table = (offsets: RotationSystem.Offset[]) => {
    const blankOffsets: RotationSystem.Offset[] = []
    return {
        [Orientation.North]: {
            [Orientation.North]: blankOffsets,
            [Orientation.East]: offsets,
            [Orientation.South]: offsets,
            [Orientation.West]: offsets
        },
        [Orientation.East]: {
            [Orientation.North]: offsets,
            [Orientation.East]: blankOffsets,
            [Orientation.South]: offsets,
            [Orientation.West]: offsets
        },
        [Orientation.South]: {
            [Orientation.North]: offsets,
            [Orientation.East]: offsets,
            [Orientation.South]: blankOffsets,
            [Orientation.West]: offsets
        },
        [Orientation.West]: {
            [Orientation.North]: offsets,
            [Orientation.East]: offsets,
            [Orientation.South]: offsets,
            [Orientation.West]: blankOffsets
        }
    }
}

const jltKickInfo = {
    table: table(defaultKickOffsets),
    validator: centralColumnValidator
}

const kickTables = {
    [TetroPiece.J]: jltKickInfo,
    [TetroPiece.L]: jltKickInfo,
    [TetroPiece.S]: { table: table(defaultKickOffsets) },
    [TetroPiece.Z]: { table: table(defaultKickOffsets) },
    [TetroPiece.T]: jltKickInfo,
    [TetroPiece.O]: { table: table([[0, 0]]) },
    [TetroPiece.I]: { table: table([[0, 0]]) }
}

export default {
    pieces: segaRS.pieces,
    rotate: RotationMethods.kickTable(kickTables),
} satisfies RotationSystem.Basis