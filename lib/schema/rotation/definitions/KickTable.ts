import Orientation from "../../../definitions/Orientation"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import RotationSystem from "./RotationSystem"

interface KickTable { 
    [Orientation.North]: KickTable.OffsetMap,
    [Orientation.East]: KickTable.OffsetMap,
    [Orientation.South]: KickTable.OffsetMap,
    [Orientation.West]: KickTable.OffsetMap 
}

namespace KickTable {

    export type FullInfo = {
        [id: PieceIdentifier]: {
            table: KickTable,
            validator?: RotationSystem.Validator
        }
    }

    export interface OffsetMap {
        [Orientation.North]: RotationSystem.Offset[]
        [Orientation.East]: RotationSystem.Offset[]
        [Orientation.South]: RotationSystem.Offset[]
        [Orientation.West]: RotationSystem.Offset[]
    }

}

export default KickTable