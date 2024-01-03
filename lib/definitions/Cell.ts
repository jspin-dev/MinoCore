import type PieceIdentifier from "./PieceIdentifier"

type Cell = Cell.Types.Active | Cell.Types.Ghost | Cell.Types.Locked | Cell.Types.Empty

namespace Cell {

    export enum Classifier {

        Active = "active",
        Ghost = "ghost",
        Locked = "locked",
        Empty = "empty"

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

}

// Convenience
namespace Cell {

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

    export let isActive = (cell: Cell): cell is Cell.Types.Active => cell.classifier == Cell.Classifier.Active

    export let isEmpty = (cell: Cell): cell is Cell.Types.Empty => cell.classifier == Cell.Classifier.Empty

    export let isGhost = (cell: Cell): cell is Cell.Types.Ghost => cell.classifier == Cell.Classifier.Ghost

    export let isLocked = (cell: Cell): cell is Cell.Types.Locked => cell.classifier == Cell.Classifier.Locked

    export let equal = (cell1: Cell, cell2: Cell): boolean => {
        if (!cell1 && !cell2) {
            return true
        }
        if (!cell1 || !cell2) {
            return false
        }
        switch (cell1.classifier) {
            case Classifier.Active:
            case Classifier.Ghost:
            case Classifier.Locked:
                return cell1.classifier == cell2.classifier && cell1.pieceId == cell2.pieceId
            case Classifier.Empty:
                return cell1.classifier == cell2.classifier
        }
    }
}

export default Cell