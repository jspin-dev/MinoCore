import PieceIdentifier from "../../definitions/PieceIdentifier"

type Cell = Cell.Types.Active | Cell.Types.Ghost | Cell.Types.Locked | Cell.Types.Empty

namespace Cell {

    export enum Classifier {

        Active, Ghost, Locked, Empty

    }

    export namespace Types {

        export interface Active {
            classifier: Classifier.Active
            pieceId: PieceIdentifier
        }
    
        export interface Ghost {
            classifier: Classifier.Ghost
            pieceId: PieceIdentifier
        }
    
        export interface Locked {
            classifier: Classifier.Locked
            pieceId: PieceIdentifier
        }
    
        export interface Empty { 
            classifier: Classifier.Empty 
        }
    
    }

    export let Empty: Types.Empty = { classifier: Classifier.Empty }

    export let Active = (pieceId: PieceIdentifier): Types.Active => {
        return { classifier: Classifier.Active, pieceId }
    }

    export let Ghost = (pieceId: PieceIdentifier): Types.Ghost => {
        return { classifier: Classifier.Ghost, pieceId }
    }

    export let Locked = (pieceId: PieceIdentifier): Types.Locked => {
        return { classifier: Classifier.Locked, pieceId }
    }

    // Type guards
    export let isActive = (cell: Cell): cell is Cell.Types.Active => cell.classifier == Cell.Classifier.Active

    export let isEmpty = (cell: Cell): cell is Cell.Types.Empty => cell.classifier == Cell.Classifier.Empty
    
    export let isGhost = (cell: Cell): cell is Cell.Types.Ghost => cell.classifier == Cell.Classifier.Ghost

    export let isLocked = (cell: Cell): cell is Cell.Types.Locked => cell.classifier == Cell.Classifier.Locked

}

export default Cell;