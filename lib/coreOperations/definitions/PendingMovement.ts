type PendingMovement = PendingMovement.Types.RightShift | PendingMovement.Types.LeftShift | PendingMovement.Types.SoftDrop

namespace PendingMovement {

    export enum Classifier {
        RightShift,
        LeftShift,
        SoftDrop
    }

    export namespace Types {

        export interface RightShift {
            classifier: Classifier.RightShift
            dx: number 
        }
    
        export interface LeftShift { 
            classifier: Classifier.LeftShift
            dx: number 
        }
    
        export interface SoftDrop { 
            classifier: Classifier.SoftDrop
            dy: number 
        }
    
    }

}

// Builders
namespace PendingMovement {

    export let RightShift = (dx: number): Types.RightShift => {
        return { classifier: Classifier.RightShift, dx }
    }

    export let LeftShift = (dx: number): Types.LeftShift => {
        return { classifier: Classifier.LeftShift, dx }
    }

    export let SoftDrop = (dy: number): Types.SoftDrop => {
        return { classifier: Classifier.SoftDrop, dy }
    }

}

// Type guards
namespace PendingMovement {

    export let isRightShift = (movement: PendingMovement): movement is PendingMovement.Types.RightShift => {
        return movement?.classifier == PendingMovement.Classifier.RightShift;
    }

    export let isLeftShift = (movement: PendingMovement): movement is PendingMovement.Types.LeftShift => {
        return movement?.classifier == PendingMovement.Classifier.LeftShift;
    }

    export let isSoftDrop = (movement: PendingMovement): movement is PendingMovement.Types.SoftDrop => {
        return movement?.classifier == PendingMovement.Classifier.SoftDrop;
    }

}

export default PendingMovement
