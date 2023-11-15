export type Step = Step.ShiftType | Step.DropType | Step.RotateType | typeof Step.Hold

export enum StepType {
    Shift = "shift",
    Drop = "drop",
    Rotate = "rotate",
    Hold = "hold"
}

export namespace Step {

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

    export type ShiftType = { type: StepType.Shift, step: ShiftStep }
    export type DropType = { type: StepType.Drop, step: DropStep}
    export type RotateType = { type: StepType.Rotate, step: RotationStep }

    let Shift = (step: ShiftStep): ShiftType => {
        return { type: StepType.Shift, step }
    }

    let Drop = (step: DropStep): DropType => {
        return { type: StepType.Drop, step }
    }

    let Rotate = (step: RotationStep): RotateType => {
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

    export let Hold = { type: StepType.Hold }

}