import type PieceIdentifier from "../../../definitions/PieceIdentifier"
import Orientation from "../../../definitions/Orientation"
import type BinaryGrid from "../../../definitions/BinaryGrid"

interface GeneratedGrids {
    generatedGrids: { [id: PieceIdentifier]: GeneratedGrids.BinaryGridSet }
}

namespace GeneratedGrids {

    export interface BinaryGridSet {
        [Orientation.North]: BinaryGrid
        [Orientation.East]: BinaryGrid
        [Orientation.South]: BinaryGrid
        [Orientation.West]: BinaryGrid
    }

}

export default GeneratedGrids