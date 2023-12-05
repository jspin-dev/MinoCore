type PendingMovement = PendingMovement.RightShiftType | PendingMovement.LeftShiftType | PendingMovement.SoftDropType 

namespace PendingMovement {

    export enum Classifier {
        RightShift,
        LeftShift,
        SoftDrop
    }

    export type RightShiftType = { classifier: Classifier.RightShift, dx: number }

    export type LeftShiftType = { classifier: Classifier.LeftShift, dx: number }

    export type SoftDropType = { classifier: Classifier.SoftDrop, dy: number }

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