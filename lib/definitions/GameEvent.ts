import Input from "./Input";
import Grid from "./Grid";
import Step from "./Step";
import ActivePiece from "./ActivePiece";
import ShiftDirection from "./ShiftDirection";
import Rotation from "./Rotation";
import Cell from "./Cell";
import PieceIdentifier from "./PieceIdentifier";

type GameEvent = GameEvent.InputStartType | GameEvent.InputEndType | GameEvent.ClockTickType 
    | GameEvent.DequeueType | GameEvent.EnqueueType | GameEvent.LockType | GameEvent.ShiftType 
    | GameEvent.RotateType | GameEvent.DropType | GameEvent.HoldType | GameEvent.SpawnType

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

    export interface InputStartType { 
        classifier: Classifier.InputStart
        input: Input.ActiveGame 
    }

    export interface InputEndType { 
        classifier: Classifier.InputEnd 
        input: Input.ActiveGame 
    }

    export interface ClockTickType { 
        classifier: Classifier.ClockTick 
    }

    export interface DequeueType { 
        classifier: Classifier.Dequeue
        dequeuedPiece: PieceIdentifier
        preview: PieceIdentifier[] 
    }

    export interface EnqueueType { 
        classifier: Classifier.Enqueue
        enqueuedPieces: PieceIdentifier[]
        preview: PieceIdentifier[] 
    }

    export interface LockType { 
        classifier: Classifier.Lock 
        activePiece: ActivePiece
        linesCleared: number[]
        playfield: Grid<Cell>
    }

    export interface ShiftType { 
        classifier: Classifier.Shift
        direction: ShiftDirection
        dx: number
        dasToWall: boolean 
    }

    export interface RotateType { 
        classifier: Classifier.Rotate
        rotation: Rotation
        previousPlayfield: Grid<Cell>
        playfield: Grid<Cell>
        activePiece: ActivePiece
    }

    export interface DropType { 
        classifier: Classifier.Drop
        dy: number
        dropType: Step.DropStep 
    }

    export interface HoldType { 
        classifier: Classifier.Hold
        previousHoldPiece: PieceIdentifier
        holdPiece: PieceIdentifier
    }

    export interface SpawnType { 
        classifier: Classifier.Spawn
        activePiece: ActivePiece 
    }

    export let InputStart = (input: Input.ActiveGame): InputStartType => {
        return { classifier: Classifier.InputStart, input }
    }   

    export let InputEnd = (input: Input.ActiveGame): InputEndType => {
        return { classifier: Classifier.InputEnd, input }
    }   

    export let ClockTick = (): ClockTickType => {
        return { classifier: Classifier.ClockTick }
    }   

    export let Dequeue = (dequeuedPiece: PieceIdentifier, preview: PieceIdentifier[]): DequeueType => {
        return { classifier: Classifier.Dequeue, dequeuedPiece, preview }
    }   
    
    export let Enqueue = (enqueuedPieces: PieceIdentifier[], preview: PieceIdentifier[]): EnqueueType => {
        return { classifier: Classifier.Enqueue, enqueuedPieces, preview }
    }   

    export let Lock = (
        activePiece: ActivePiece, 
        linesCleared: number[], 
        playfield: Grid<Cell>
    ): LockType => { 
        return { classifier: Classifier.Lock, activePiece, linesCleared, playfield }
    }

    export let Shift = (direction: ShiftDirection, dx: number, dasToWall: boolean): ShiftType => {
        return { classifier: Classifier.Shift, direction, dx, dasToWall }
    }

    export let Rotate = (
        rotation: Rotation,  
        previousPlayfield:  Grid<Cell>, 
        playfield: Grid<Cell>, 
        activePiece: ActivePiece
    ): RotateType => {
        return { classifier: Classifier.Rotate, rotation, previousPlayfield, playfield, activePiece }
    }

    export let Drop = (dy: number, dropType: Step.DropStep): DropType => {
        return { classifier: Classifier.Drop, dy, dropType }
    }

    export let Hold = (previousHoldPiece: PieceIdentifier, holdPiece: PieceIdentifier): HoldType => {
        return { classifier: Classifier.Hold, previousHoldPiece, holdPiece }
    }   
    
    export let Spawn = (activePiece: ActivePiece): SpawnType => {
        return { classifier: Classifier.Spawn, activePiece }
    }    

}

export default GameEvent;