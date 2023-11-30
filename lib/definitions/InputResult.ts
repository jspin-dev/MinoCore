import { ShiftDirection } from "./playfieldDefinitions"
import { Rotation } from "./rotationDefinitions"
import { Step, StepType } from "./steps"

type InputResult = InputResult.ShiftType | InputResult.RotateType | InputResult.DropType | InputResult.HoldType

namespace InputResult {

    export type ShiftType = { stepType: StepType.Shift, direction: ShiftDirection, dx: number, dasToWall: boolean }

    export type RotateType = { stepType: StepType.Rotate, rotation: Rotation }

    export type DropType = { stepType: StepType.Drop, dy: number, dropType: Step.DropStep }

    export type HoldType = { stepType: StepType.Hold }

    export let Shift = (direction: ShiftDirection, dx: number, dasToWall: boolean): ShiftType => {
        return { stepType: StepType.Shift, direction, dx, dasToWall }
    }

    export let Rotate = (rotation: Rotation): RotateType => {
        return { stepType: StepType.Rotate, rotation }
    }

    export let Drop = (dy: number, dropType: Step.DropStep): DropType => {
        return { stepType: StepType.Drop, dy, dropType }
    }

    export let Hold = () => {
        return { stepType: StepType.Hold }
    }

}

export default InputResult;