import Orientation from "../../../definitions/Orientation"
import RotationSystem from "../../../schema/rotation/definitions/RotationSystem"
import TetroPiece from "../TetroPiece"
import RotationMethods from "../../../schema/rotation/rotationMethods"
import KickTable from "../../../schema/rotation/definitions/KickTable"
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
    } satisfies KickTable
}

const jltKickInfo = {
    table: table(defaultKickOffsets),
    validator: centralColumnValidator
}
const zsKickInfo = {
    table: table(defaultKickOffsets)
}
const ioKickInfo = {
    table: table([[0, 0]])
}

const kickTables = {
    [TetroPiece.J]: jltKickInfo,
    [TetroPiece.L]: jltKickInfo,
    [TetroPiece.S]: zsKickInfo,
    [TetroPiece.Z]: zsKickInfo,
    [TetroPiece.T]: jltKickInfo,
    [TetroPiece.O]: ioKickInfo,
    [TetroPiece.I]: ioKickInfo
} satisfies KickTable.FullInfo

export default {
    initialize: segaRS.initialize,
    getSpawnInfo: segaRS.getSpawnInfo,
    rotate: RotationMethods.kickTable(kickTables),
} satisfies RotationSystem