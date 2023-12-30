import Orientation from "../../../definitions/Orientation"
import RotationSystem from "../../../schema/rotation/definitions/RotationSystem"
import TetroPiece from "../TetroPiece"
import RotationMethods from "../../../schema/rotation/rotationMethods"
import KickTable from "../../../schema/rotation/definitions/KickTable"
import { centralColumnValidator } from "../tetroRotationValidators"
import segaRS from "./segaRS"

let defaultKickOffsets: RotationSystem.Offset[] = [[0, 0], [1, 0], [-1, 0]]

let simpleKickTable = (offsets: RotationSystem.Offset[]): KickTable => {
    return {
        [Orientation.North]: {
            [Orientation.North]: [],
            [Orientation.East]: offsets,
            [Orientation.South]: offsets,
            [Orientation.West]: offsets
        },
        [Orientation.East]: {
            [Orientation.North]: offsets,
            [Orientation.East]: [],
            [Orientation.South]: offsets,
            [Orientation.West]: offsets
        },
        [Orientation.South]: {
            [Orientation.North]: offsets,
            [Orientation.East]: offsets,
            [Orientation.South]: [],
            [Orientation.West]: offsets
        },
        [Orientation.West]: {
            [Orientation.North]: offsets,
            [Orientation.East]: offsets,
            [Orientation.South]: offsets,
            [Orientation.West]: []
        }
    }
}

let jltKickInfo = {
    table: simpleKickTable(defaultKickOffsets),
    validator: centralColumnValidator
}
let zsKickInfo = {
    table: simpleKickTable(defaultKickOffsets)
}
let ioKickInfo = {
    table: simpleKickTable([[0, 0]])
}

let kickTables: KickTable.FullInfo = {
    [TetroPiece.J]: jltKickInfo,
    [TetroPiece.L]: jltKickInfo,
    [TetroPiece.S]: zsKickInfo,
    [TetroPiece.Z]: zsKickInfo,
    [TetroPiece.T]: jltKickInfo,
    [TetroPiece.O]: ioKickInfo,
    [TetroPiece.I]: ioKickInfo
}

let rotationSystem: RotationSystem = {
    initialize: segaRS.initialize,
    getSpawnInfo: segaRS.getSpawnInfo,
    rotate: RotationMethods.kickTable(kickTables),
}

export default rotationSystem