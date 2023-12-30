import PieceIdentifier from "../../definitions/PieceIdentifier"

enum TetroPiece {
    I = 1,
    J = 2,
    L = 3,
    O = 4,
    S = 5,
    T = 6,
    Z = 7
}

namespace TetroPiece {

    export let identifiers: PieceIdentifier[] = [
        TetroPiece.I,
        TetroPiece.J,
        TetroPiece.L,
        TetroPiece.O,
        TetroPiece.S,
        TetroPiece.T,
        TetroPiece.Z
    ]

}

export default TetroPiece
