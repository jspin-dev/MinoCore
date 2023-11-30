import { Input } from "./inputDefinitions";
import { ShiftDirection } from "./playfieldDefinitions";
import { Step, StepType } from "../definitions/steps"
import { Rotation } from "./rotationDefinitions";
import InputResult from "./InputResult";

type GameEvent = GameEvent.ClockTickType | GameEvent.InputResultType | GameEvent.LockType

namespace GameEvent {

    export enum Classifier {
        ClockTick,
        InputResult,
        //Next,
        //Spawn,
        Lock,
        //LineClear
    }

    export type ClockTickType = { classifier: Classifier.ClockTick }

    export type InputResultType = { classifier: Classifier.InputResult, result: InputResult }

    export type LockType = { classifier: Classifier.Lock, pieceId: number }

    export let InputResult = (result: InputResult): InputResultType => {
        return { classifier: Classifier.InputResult, result }
    }

}

export default GameEvent;