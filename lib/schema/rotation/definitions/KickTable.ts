import Orientation from "../../../definitions/Orientation"
import PieceIdentifier from "../../../definitions/PieceIdentifier"
import RotationSystemBasis from "./RotationSystem"

type KickTable = Record<Orientation, KickTable.OffsetMap>

namespace KickTable {

    export type FullInfo = {
        [id: PieceIdentifier]: {
            table: KickTable,
            validator?: RotationSystemBasis.Validator
        }
    }

    export type OffsetMap = Record<Orientation, RotationSystemBasis.Offset[]>

}

export default KickTable