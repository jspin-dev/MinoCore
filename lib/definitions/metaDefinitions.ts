import type { Immutable } from "immer";

export enum ActiveGameInput {
    ShiftLeft,
    ShiftRight,
    RotateCW,
    RotateCCW,
    Rotate180,
    HD,
    SD,
    Hold
}

export enum TimerOperation {
    Start = "start",
    Pause = "pause",
    Resume = "resume",
    Cancel = "cancel"
}

export enum TimerName {
    Clock = "clock",
    AutoDrop = "autodrop",
    AutoShift = "autoShift",
    DAS = "das",
    DropLock = "dropLock"
}

export type Instruction = {
    id: number,
    info: InstructionInfo
}
export type InstructionInfo = TimerInstructionInfo | AddRandomNumbersInfo

export type TimerInstructionInfo = TimerDelayInfo | TimerInfo | GlobalTimerInfo

export type AddRandomNumbersInfo = Immutable<{
    quantity: number
}>

export type TimerDelayInfo = Immutable<{
    timerName: TimerName,
    delay: number
}>

export type TimerInfo = Immutable<{
    timerName: TimerName,
    operation: TimerOperation
}>

export type GlobalTimerInfo = Immutable<{
    operation: TimerOperation
}>

export function isTimerDelayInfo(instructionInfo: InstructionInfo): instructionInfo is TimerDelayInfo {
    let timerDelayInfo = instructionInfo as TimerDelayInfo
    return "timerName" in timerDelayInfo && "delay" in timerDelayInfo;
}
export function isTimerInfo(instructionInfo: InstructionInfo): instructionInfo is TimerInfo {
    let timerInfo = instructionInfo as TimerInfo
    return "timerName" in timerInfo && "operation" in timerInfo;
}

export function isGlobalTimerInfo(instructionInfo: InstructionInfo): instructionInfo is GlobalTimerInfo {
    let globalTimerInfo = instructionInfo as GlobalTimerInfo
    return !("timerName" in globalTimerInfo) && "operation" in globalTimerInfo;
}

export function isAddRandomNumberInfo(
    instructionInfo: InstructionInfo
): instructionInfo is AddRandomNumbersInfo {
    return "quantity" in (instructionInfo as AddRandomNumbersInfo);
}


export enum GameOverCondition {
    Blockout,
    Lockout,
    Topout
}

export namespace GameStatus {

    export type Any = GameOverType |
        typeof Initialized | 
        typeof Ready | 
        typeof Active | 
        typeof Suspended | 
        typeof GoalComplete
        

    export type GameOverType =  { 
        classifier: Classifier.GameOver,
        condition: GameOverCondition
    }

    export enum Classifier {
        Initialized,
        Ready,
        Active,
        Suspended,
        GameOver, // topout, lockout, or blockout
        GoalComplete
    }

    export let Initialized = { classifier: Classifier.Initialized }

    export let Ready = { classifier: Classifier.Ready }

    export let Active = { classifier: Classifier.Active }

    export let Suspended = { classifier: Classifier.Suspended }

    export let GoalComplete = { classifier: Classifier.GoalComplete }

    export let GameOver = (condition: GameOverCondition): GameOverType => {
        return { 
            classifier: Classifier.GameOver,
            condition
        }
    }

}
