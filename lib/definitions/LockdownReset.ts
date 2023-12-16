namespace LockdownReset {

    export type Method = AnyPieceMovementMethod | MaxDropProgressionOnlyMethod

    export enum Classifier {
        AnyPieceMovement,
        MaxDropProgressionOnly
    }

    export interface AnyPieceMovementMethod {
        classifier: Classifier.AnyPieceMovement
        moveLimit?: number
    }
    
    export interface MaxDropProgressionOnlyMethod {
        classifier: Classifier.MaxDropProgressionOnly
    }

}

export default LockdownReset;