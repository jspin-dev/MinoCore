import StepType from "./StepType"

type Step = Step.Types.Shift | Step.Types.Drop | Step.Types.Rotate | Step.Types.Hold

namespace Step {

    export enum ShiftStep {
        TapRight,
        TapLeft,
        DasRight,
        DasLeft
    }

    export enum DropStep {
        SoftDrop,
        HardDrop,
        SoftDropToFloor
    }

    export enum RotationStep {
        RotateCCW,
        RotateCW
    }

    export namespace Types {

        export interface Shift {
            type: StepType.Shift,
            step: ShiftStep
        }

        export interface Drop {
            type: StepType.Drop,
            step: DropStep
        }

        export interface Rotate {
            type: StepType.Rotate,
            step: RotationStep
        }

        export interface Hold {
            type: StepType.Hold
        }

    }

}

// Convenience
namespace Step {

    let Shift = (step: ShiftStep): Types.Shift => {
        return { type: StepType.Shift, step }
    }

    let Drop = (step: DropStep): Types.Drop => {
        return { type: StepType.Drop, step }
    }

    let Rotate = (step: RotationStep): Types.Rotate => {
        return { type: StepType.Rotate, step }
    }

    export let TapLeft = Shift(ShiftStep.TapLeft)
    export let TapRight = Shift(ShiftStep.TapRight)
    export let SoftDrop = Drop(DropStep.SoftDrop)
    export let RotateCCW = Rotate(RotationStep.RotateCCW)
    export let RotateCW = Rotate(RotationStep.RotateCW)
    export let HardDrop = Drop(DropStep.HardDrop)
    export let SoftDropToFloor = Drop(DropStep.SoftDropToFloor)
    export let DasRight = Shift(ShiftStep.DasRight)
    export let DasLeft = Shift(ShiftStep.DasLeft)

    export let Hold: Types.Hold = { type: StepType.Hold }

}

export default Step