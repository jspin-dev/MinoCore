import { Input } from "./inputDefinitions";
import { ActivePiece, ShiftDirection } from "./playfieldDefinitions";
import { Rotation } from "./rotationDefinitions";
import { Grid } from "./shared/Grid";
import { Step } from "./steps";

type GameEvent = GameEvent.InputStartType | GameEvent.InputEndType | GameEvent.ClockTickType | GameEvent.DequeueType 
    | GameEvent.EnqueueType | GameEvent.LockType | GameEvent.ShiftType | GameEvent.RotateType | GameEvent.DropType 
    | GameEvent.HoldType | GameEvent.SpawnType

namespace GameEvent {

    export enum Classifier {

        InputStart = "inputstart",
        InputEnd = "inputend",
        ClockTick = "clocktick",
        Dequeue = "dequeue",
        Enqueue = "enqueue",
        Lock = "lock",
        Shift = "shift",
        Rotate = "rotate",
        Drop = "drop",
        Hold = "hold",
        Spawn = "spawn"

    }

    export type InputStartType = { classifier: Classifier.InputStart, input: Input.ActiveGame }

    export type InputEndType = { classifier: Classifier.InputEnd, input: Input.ActiveGame }

    export type ClockTickType = { classifier: Classifier.ClockTick }

    export type DequeueType = { classifier: Classifier.Dequeue, dequeuedPiece: number, preview: number[] }

    export type EnqueueType = { classifier: Classifier.Enqueue, enqueuedPieces: number[], preview: number[] }

    export type LockType = { classifier: Classifier.Lock, activePiece: ActivePiece, linesCleared: number[], playfield: Grid }

    export type ShiftType = { classifier: Classifier.Shift, direction: ShiftDirection, dx: number, dasToWall: boolean }

    export type RotateType = { 
        classifier: Classifier.Rotate, 
        rotation: Rotation, 
        previousPlayfield: Grid, 
        playfield: Grid,
        activePiece: ActivePiece
    }

    export type DropType = { classifier: Classifier.Drop, dy: number, dropType: Step.DropStep }

    export type HoldType = { 
        classifier: Classifier.Hold,
        previousHoldPiece: number,
        holdPiece: number
    }

    export type SpawnType = { classifier: Classifier.Spawn, activePiece: ActivePiece }

    export let InputStart = (input: Input.ActiveGame): InputStartType => {
        return { classifier: Classifier.InputStart, input }
    }   

    export let InputEnd = (input: Input.ActiveGame): InputEndType => {
        return { classifier: Classifier.InputEnd, input }
    }   

    export let ClockTick = (): ClockTickType => {
        return { classifier: Classifier.ClockTick }
    }   

    export let Dequeue = (dequeuedPiece: number, preview: number[]): DequeueType => {
        return { classifier: Classifier.Dequeue, dequeuedPiece, preview }
    }   
    
    export let Enqueue = (enqueuedPieces: number[], preview: number[]): EnqueueType => {
        return { classifier: Classifier.Enqueue, enqueuedPieces, preview }
    }   

    export let Lock = (activePiece: ActivePiece, linesCleared: number[], playfield: Grid): LockType => { 
        return { classifier: Classifier.Lock, activePiece, linesCleared, playfield }
    }

    export let Shift = (direction: ShiftDirection, dx: number, dasToWall: boolean): ShiftType => {
        return { classifier: Classifier.Shift, direction, dx, dasToWall }
    }

    export let Rotate = (
        rotation: Rotation,  
        previousPlayfield: Grid, 
        playfield: Grid, 
        activePiece: ActivePiece
    ): RotateType => {
        return { classifier: Classifier.Rotate, rotation, previousPlayfield, playfield, activePiece }
    }

    export let Drop = (dy: number, dropType: Step.DropStep): DropType => {
        return { classifier: Classifier.Drop, dy, dropType }
    }

    export let Hold = (previousHoldPiece: number, holdPiece: number): HoldType => {
        return { classifier: Classifier.Hold, previousHoldPiece, holdPiece }
    }   
    
    export let Spawn = (activePiece: ActivePiece): SpawnType => {
        return { classifier: Classifier.Spawn, activePiece }
    }    

}

export default GameEvent;