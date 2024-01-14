import type PieceIdentifier from "../../../definitions/PieceIdentifier"
import Orientation from "../../../definitions/Orientation"
import type BinaryGrid from "../../../definitions/BinaryGrid"

interface GeneratedGrids {
    generatedGrids: { [id: PieceIdentifier]: GeneratedGrids.BinaryGridSet }
}

namespace GeneratedGrids {

    export type BinaryGridSet = Record<Orientation, BinaryGrid>

}

export default GeneratedGrids