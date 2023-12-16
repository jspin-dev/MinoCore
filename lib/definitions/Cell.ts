import PieceIdentity from "./PieceIdentifier"

type Cell = Cell.MinoType | Cell.EmptyType

namespace Cell {

    export enum Classifier {
        Mino,
        Empty
    }

    export interface MinoType {
        classifier: Classifier.Mino
        piece: PieceIdentity
        ghost: boolean
    }

    export interface EmptyType { 
        classifier: Classifier.Empty 
    }

    export let Empty: EmptyType = { classifier: Classifier.Empty }

    export let Mino = (piece: PieceIdentity, ghost: boolean = false): MinoType => {
        return { classifier: Classifier.Mino, piece, ghost }
    }

}

export default Cell;