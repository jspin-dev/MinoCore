import Orientation from "../../../definitions/Orientation"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import RotationSystem from "./RotationSystem"

type KickTable = Record<Orientation, KickTable.OffsetMap>

namespace KickTable {

    export type FullInfo = {
        [id: PieceIdentifier]: {
            table: KickTable,
            validator?: RotationSystem.Validator
        }
    }

    export type OffsetMap = Record<Orientation, RotationSystem.Offset[]>

}

export default KickTable