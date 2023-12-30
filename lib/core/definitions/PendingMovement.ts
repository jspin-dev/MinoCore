import ShiftDirection from "../../definitions/ShiftDirection"
import DropType from "../../definitions/DropType"

type PendingMovement = PendingMovement.Types.Shift | PendingMovement.Types.Drop

namespace PendingMovement {

    export enum Classifier {
        Shift,
        Drop
    }

    export namespace Types {

        export interface Shift {
            classifier: Classifier.Shift
            direction: ShiftDirection,
            dx: number 
        }

        export interface Drop {
            classifier: Classifier.Drop,
            type: DropType,
            dy: number
        }
    
    }

}

// Builders
namespace PendingMovement {

    export let Shift = (direction: ShiftDirection, dx: number): Types.Shift => {
        return { classifier: Classifier.Shift, direction, dx }
    }

    export let Drop = (type: DropType, dy: number): Types.Drop => {
        return { classifier: Classifier.Drop, type, dy }
    }

}

// Type guards
namespace PendingMovement {

    export let isShift = (movement?: PendingMovement): movement is PendingMovement.Types.Shift => {
        return movement?.classifier == PendingMovement.Classifier.Shift
    }

    export let isDrop = (movement?: PendingMovement): movement is PendingMovement.Types.Drop => {
        return movement?.classifier == PendingMovement.Classifier.Drop;
    }

}

export default PendingMovement
