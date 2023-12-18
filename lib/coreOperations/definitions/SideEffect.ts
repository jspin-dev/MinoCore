namespace SideEffect {

    export type Request =  Request.TimerIntervalType | Request.TimerOperationType | Request.RngType

    export namespace Request {

        export enum Classifier {
            TimerInterval,
            TimerOperation,
            Rng
        }
    
        export interface TimerIntervalType {
            classifier: Classifier.TimerInterval
            timerName: TimerName
            delay: number
        }
    
        export interface TimerOperationType {
            classifier: Classifier.TimerOperation
            timerName: TimerName
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

    export enum TimerName {
        Clock = "clock",
        AutoDrop = "autodrop",
        AutoShift = "autoShift",
        DAS = "das",
        DropLock = "dropLock"
    }    

    export enum TimerOperation {
        Start = "start",
        Pause = "pause",
        Resume = "resume",
        Cancel = "cancel"
    }

}

export default SideEffect;