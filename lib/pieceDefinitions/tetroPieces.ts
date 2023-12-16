import PieceDefinition from "../definitions/PieceDefinition"
import TetroPiece from "../definitions/TetroPiece"

let pieceDefinitions: PieceDefinition[] = [
    {
        piece: TetroPiece.I,
        shape: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    },
    {
        piece: TetroPiece.J,
        shape: [
            [1, 0, 0], 
            [1, 1, 1], 
            [0, 0, 0]
        ]
    },
    {
        piece: TetroPiece.L,
        shape: [
            [0, 0, 1], 
            [1, 1, 1], 
            [0, 0, 0]
        ]
    },
    {
        piece: TetroPiece.O,
        shape: [
            [1, 1], 
            [1, 1]
        ]
    },
    {
        piece: TetroPiece.S,
        shape: [
            [0, 1, 1], 
            [1, 1, 0], 
            [0, 0, 0]
        ]
    },
    {
        piece: TetroPiece.Z,
        shape: [
            [1, 1, 0], 
            [0, 1, 1], 
            [0, 0, 0]
        ]
    },
    {
        piece: TetroPiece.T,
        shape: [
            [0, 1, 0], 
            [1, 1, 1], 
            [0, 0, 0]
        ]
    }
]
export default pieceDefinitions;