export namespace SideEffectRequest {

    export type Any = TimerIntervalType | TimerOperationType | RngType

    export enum Classifier {
        TimerInterval,
        TimerOperation,
        Rng
    }

    export type TimerIntervalType = {
        classifier: Classifier.TimerInterval,
        timerName: TimerName,
        delay: number
    }

    export type TimerOperationType = {
        classifier: Classifier.TimerOperation,
        timerName: TimerName,
        operation: TimerOperation
    }

    export type RngType = { classifier: Classifier.Rng, quantity: number }

    export let TimerInterval = (timerName: TimerName, delay: number): TimerIntervalType => {
        return {
            classifier: Classifier.TimerInterval,
            timerName,
            delay
        }
    }

    export let TimerOperation = (timerName: TimerName, operation: TimerOperation): TimerOperationType => {
        return { 
            classifier: Classifier.TimerOperation, 
            timerName, 
            operation
        }
    }

    export let Rng = (quantity: number): RngType => {
        return { classifier: Classifier.Rng, quantity }
    }

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

export enum GameOverCondition {
    Blockout,
    Lockout,
    Topout
}

export type GameStatus = GameStatus.GameOverType |
    typeof GameStatus.Initialized | 
    typeof GameStatus.Ready | 
    typeof GameStatus.Active | 
    typeof GameStatus.Suspended

export namespace GameStatus {

    export type GameOverType =  { 
        classifier: Classifier.GameOver,
        condition: GameOverCondition
    }

    export enum Classifier {
        Initialized, // Game has been initialized but is not ready to play (ie no next queue)
        Ready, // Game is ready to be played
        Active, // Game is accepting inputs and the main timer is active
        Suspended, // Example uses: game is paused, game has "ended" but not by gameover, etc.
        GameOver, // topout, lockout, or blockout
    }

    export let Initialized = { classifier: Classifier.Initialized }

    export let Ready = { classifier: Classifier.Ready }

    export let Active = { classifier: Classifier.Active }

    export let Suspended = { classifier: Classifier.Suspended }

    export let GameOver = (condition: GameOverCondition): GameOverType => {
        return { 
            classifier: Classifier.GameOver,
            condition
        }
    }

}
