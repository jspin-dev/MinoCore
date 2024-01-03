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

// Convenience
namespace PendingMovement {

    export let Shift = (params: { direction: ShiftDirection, dx: number }): Types.Shift => {
        return { classifier: Classifier.Shift, direction: params.direction, dx: params.dx }
    }

    export let Drop = (params: { type: DropType, dy: number }): Types.Drop => {
        return { classifier: Classifier.Drop, type: params.type, dy: params.dy }
    }

    export let equal = (pendingMovement1: PendingMovement, pendingMovement2: PendingMovement) => {
        if (!pendingMovement1 && !pendingMovement2) {
            return true
        }
        if (!pendingMovement1 || !pendingMovement2) {
            return false
        }
        switch (pendingMovement1.classifier) {
            case PendingMovement.Classifier.Drop:
                return pendingMovement2.classifier == PendingMovement.Classifier.Drop
                    && pendingMovement1.dy == pendingMovement2.dy
                    && pendingMovement1.type == pendingMovement2.type
            case PendingMovement.Classifier.Shift:
                return pendingMovement2.classifier == PendingMovement.Classifier.Shift
                    && pendingMovement1.dx == pendingMovement2.dx
                    && pendingMovement1.direction == pendingMovement2.direction
        }
    }

    export let isShift = (movement?: PendingMovement): movement is PendingMovement.Types.Shift => {
        return movement?.classifier == PendingMovement.Classifier.Shift
    }

    export let isDrop = (movement?: PendingMovement): movement is PendingMovement.Types.Drop => {
        return movement?.classifier == PendingMovement.Classifier.Drop
    }

}

export default PendingMovement
