type PendingMovement = PendingMovement.RightShiftType | PendingMovement.LeftShiftType | PendingMovement.SoftDropType 

namespace PendingMovement {

    export enum Classifier {
        RightShift,
        LeftShift,
        SoftDrop
    }

    export interface RightShiftType {
        classifier: Classifier.RightShift
        dx: number 
    }

    export interface LeftShiftType { 
        classifier: Classifier.LeftShift
        dx: number 
    }

    export interface SoftDropType { 
        classifier: Classifier.SoftDrop
        dy: number 
    }

    export let RightShift = (dx: number): RightShiftType => {
        return { classifier: Classifier.RightShift, dx }
    }

    export let LeftShift = (dx: number): LeftShiftType => {
        return { classifier: Classifier.LeftShift, dx }
    }

    export let SoftDrop = (dy: number): SoftDropType => {
        return { classifier: Classifier.SoftDrop, dy }
    }

}

export default PendingMovement