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

    const Shift = (step: ShiftStep) => {
        return { type: StepType.Shift, step } satisfies Types.Shift
    }

    const Drop = (step: DropStep) => {
        return { type: StepType.Drop, step } satisfies Types.Drop
    }

    const Rotate = (step: RotationStep) => {
        return { type: StepType.Rotate, step } satisfies Types.Rotate
    }

    export const TapLeft = Shift(ShiftStep.TapLeft)
    export const TapRight = Shift(ShiftStep.TapRight)
    export const SoftDrop = Drop(DropStep.SoftDrop)
    export const RotateCCW = Rotate(RotationStep.RotateCCW)
    export const RotateCW = Rotate(RotationStep.RotateCW)
    export const HardDrop = Drop(DropStep.HardDrop)
    export const SoftDropToFloor = Drop(DropStep.SoftDropToFloor)
    export const DasRight = Shift(ShiftStep.DasRight)
    export const DasLeft = Shift(ShiftStep.DasLeft)

    export const Hold = { type: StepType.Hold }

}

export default Step