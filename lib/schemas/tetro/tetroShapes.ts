import BinaryGrid from "../../definitions/BinaryGrid";
import PieceIdentifier from "../../definitions/PieceIdentifier";
import TetroPiece from "./TetroPiece";

let shapes: { [id: PieceIdentifier]: BinaryGrid } = {
    [TetroPiece.I]: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [TetroPiece.J]: [
        [1, 0, 0], 
        [1, 1, 1], 
        [0, 0, 0]
    ],
    [TetroPiece.L]: [
        [0, 0, 1], 
        [1, 1, 1], 
        [0, 0, 0]
    ],
    [TetroPiece.O]: [
        [1, 1], 
        [1, 1]
    ],
    [TetroPiece.S]: [
        [0, 1, 1], 
        [1, 1, 0], 
        [0, 0, 0]
    ],
    [TetroPiece.Z]: [
        [1, 1, 0], 
        [0, 1, 1], 
        [0, 0, 0]
    ],
    [TetroPiece.T]: [
        [0, 1, 0], 
        [1, 1, 1], 
        [0, 0, 0]
    ]
}

export default shapes;