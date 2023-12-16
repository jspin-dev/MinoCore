import BinaryGrid from "./BinaryGrid"
import PieceIdentity from "./PieceIdentifier"

export default interface PieceDefinition {
    piece: PieceIdentity
    shape: BinaryGrid
}
