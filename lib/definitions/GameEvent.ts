import type Input from "./Input"
import type ActivePiece from "./ActivePiece"
import type ShiftDirection from "./ShiftDirection"
import type Rotation from "./Rotation"
import type PieceIdentifier from "./PieceIdentifier"
import type Playfield from "./Playfield"
import type DropType from "./DropType"

type GameEvent = GameEvent.Types.InputStart | GameEvent.Types.InputEnd | GameEvent.Types.ClockTick
    | GameEvent.Types.Dequeue | GameEvent.Types.Enqueue | GameEvent.Types.Lock | GameEvent.Types.Clear
    | GameEvent.Types.Shift | GameEvent.Types.Rotate | GameEvent.Types.Drop | GameEvent.Types.Hold
    | GameEvent.Types.Spawn

namespace GameEvent {

    export enum Classifier {

        InputStart = "inputstart",
        InputEnd = "inputend",
        ClockTick = "clocktick",
        Dequeue = "dequeue",
        Enqueue = "enqueue",
        Lock = "lock",
        Clear = "clear",
        Shift = "shift",
        Rotate = "rotate",
        Drop = "drop",
        Hold = "hold",
        Spawn = "spawn"

    }

}

namespace GameEvent {

    export namespace Types {

        export interface InputStart {
            classifier: Classifier.InputStart
            input: Input.ActiveGame
        }

        export interface InputEnd {
            classifier: Classifier.InputEnd
            input: Input.ActiveGame
        }

        export interface ClockTick {
            classifier: Classifier.ClockTick
        }

        export interface Dequeue {
            classifier: Classifier.Dequeue
            dequeuedPiece: PieceIdentifier
            preview: PieceIdentifier[]
        }

        export interface Enqueue {
            classifier: Classifier.Enqueue
            preview: PieceIdentifier[]
        }

        export interface Lock {
            classifier: Classifier.Lock
            activePiece: ActivePiece
        }

        export interface Clear {
            classifier: Classifier.Clear
            activePiece: ActivePiece
            linesCleared: number[]
            playfield: Playfield
        }

        export interface Shift {
            classifier: Classifier.Shift
            direction: ShiftDirection
            dx: number
            dasToWall: boolean
        }

        export interface Rotate {
            classifier: Classifier.Rotate
            rotation: Rotation
            previousPlayfield: Playfield
            playfield: Playfield
            activePiece: ActivePiece
        }

        export interface Drop {
            classifier: Classifier.Drop
            dy: number
            dropType: DropType
        }

        export interface Hold {
            classifier: Classifier.Hold
            previousHoldPiece: PieceIdentifier
            holdPiece: PieceIdentifier
        }

        export interface Spawn {
            classifier: Classifier.Spawn
            activePiece: ActivePiece
        }

    }

}

namespace GameEvent {

    export let InputStart = (input: Input.ActiveGame): Types.InputStart => {
        return { classifier: Classifier.InputStart, input }
    }   

    export let InputEnd = (input: Input.ActiveGame): Types.InputEnd => {
        return { classifier: Classifier.InputEnd, input }
    }   

    export let ClockTick = (): Types.ClockTick => {
        return { classifier: Classifier.ClockTick }
    }   

    export let Dequeue = (params: { dequeuedPiece: PieceIdentifier, preview: PieceIdentifier[] }): Types.Dequeue => {
        return {
            classifier: Classifier.Dequeue,
            dequeuedPiece: params.dequeuedPiece,
            preview: params.preview
        }
    }   
    
    export let Enqueue = (params: { preview: PieceIdentifier[] }): Types.Enqueue => {
        return { classifier: Classifier.Enqueue, preview: params.preview }
    }   

    export let Lock = (params: { activePiece: ActivePiece }): Types.Lock => {
        return { classifier: Classifier.Lock, activePiece: params.activePiece }
    }

    export let Clear = (
        params: {
            activePiece: ActivePiece,
            linesCleared: number[],
            playfield: Playfield
        }
    ): Types.Clear => {
        return {
            classifier: Classifier.Clear,
            activePiece: params.activePiece,
            linesCleared: params.linesCleared,
            playfield: params.playfield
        }
    }

    export let Shift = (params: { direction: ShiftDirection, dx: number, dasToWall: boolean }): Types.Shift => {
        return {
            classifier: Classifier.Shift,
            direction: params.direction,
            dx: params.dx,
            dasToWall: params.dasToWall
        }
    }

    export let Rotate = (
        params: {
            rotation: Rotation,
            previousPlayfield:  Playfield,
            playfield: Playfield,
            activePiece: ActivePiece
        }
    ): Types.Rotate => {
        return {
            classifier: Classifier.Rotate,
            rotation: params.rotation,
            previousPlayfield: params.previousPlayfield,
            playfield: params.playfield,
            activePiece: params.activePiece
        }
    }

    export let Drop = (params: { dy: number, dropType: DropType }): Types.Drop => {
        return {
            classifier: Classifier.Drop,
            dy: params.dy,
            dropType: params.dropType
        }
    }

    export let Hold = (params: { previousHoldPiece: PieceIdentifier, holdPiece: PieceIdentifier }): Types.Hold => {
        return {
            classifier: Classifier.Hold,
            previousHoldPiece: params.previousHoldPiece,
            holdPiece: params.holdPiece
        }
    }   
    
    export let Spawn = (params: { activePiece: ActivePiece }): Types.Spawn => {
        return { classifier: Classifier.Spawn, activePiece: params.activePiece }
    }    

}

export default GameEvent