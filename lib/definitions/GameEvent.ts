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
    | GameEvent.Types.Spawn | GameEvent.Types.Restart | GameEvent.Types.Initialized

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
        Spawn = "spawn",
        Restart = "restart",
        Initialized = "initialize"

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

        export interface Restart {
            classifier: Classifier.Restart
        }

        export interface Initialized {
            classifier: Classifier.Initialized
        }

    }

}

// Convenience
namespace GameEvent {

    export const ClockTick = { classifier: Classifier.ClockTick } satisfies Types.ClockTick

    export const Restart = { classifier: Classifier.Restart } satisfies Types.Restart

    export const Initialized = { classifier: Classifier.Initialized } satisfies Types.Initialized

    export const InputStart = (input: Input.ActiveGame) => {
        return { classifier: Classifier.InputStart, input } satisfies Types.InputStart
    }   

    export const InputEnd = (input: Input.ActiveGame) => {
        return { classifier: Classifier.InputEnd, input } satisfies Types.InputEnd
    }

    export const Dequeue = (params: { dequeuedPiece: PieceIdentifier, preview: PieceIdentifier[] }) => {
        return {
            classifier: Classifier.Dequeue,
            dequeuedPiece: params.dequeuedPiece,
            preview: params.preview
        } satisfies Types.Dequeue
    }   
    
    export const Enqueue = (params: { preview: PieceIdentifier[] }) => {
        return { classifier: Classifier.Enqueue, preview: params.preview } satisfies Types.Enqueue
    }   

    export const Lock = (params: { activePiece: ActivePiece }) => {
        return { classifier: Classifier.Lock, activePiece: params.activePiece } satisfies Types.Lock
    }

    export const Clear = (
        params: {
            activePiece: ActivePiece,
            linesCleared: number[],
            playfield: Playfield
        }
    ) => {
        return {
            classifier: Classifier.Clear,
            activePiece: params.activePiece,
            linesCleared: params.linesCleared,
            playfield: params.playfield
        } satisfies Types.Clear
    }

    export const Shift = (params: { direction: ShiftDirection, dx: number, dasToWall: boolean }) => {
        return {
            classifier: Classifier.Shift,
            direction: params.direction,
            dx: params.dx,
            dasToWall: params.dasToWall
        } satisfies Types.Shift
    }

    export const Rotate = (
        params: {
            rotation: Rotation,
            previousPlayfield:  Playfield,
            playfield: Playfield,
            activePiece: ActivePiece
        }
    ) => {
        return {
            classifier: Classifier.Rotate,
            rotation: params.rotation,
            previousPlayfield: params.previousPlayfield,
            playfield: params.playfield,
            activePiece: params.activePiece
        } satisfies Types.Rotate
    }

    export const Drop = (params: { dy: number, dropType: DropType }) => {
        return {
            classifier: Classifier.Drop,
            dy: params.dy,
            dropType: params.dropType
        } satisfies Types.Drop
    }

    export const Hold = (params: { previousHoldPiece: PieceIdentifier, holdPiece: PieceIdentifier }) => {
        return {
            classifier: Classifier.Hold,
            previousHoldPiece: params.previousHoldPiece,
            holdPiece: params.holdPiece
        } satisfies Types.Hold
    }   
    
    export const Spawn = (params: { activePiece: ActivePiece }) => {
        return { classifier: Classifier.Spawn, activePiece: params.activePiece } satisfies Types.Spawn
    }

}

export default GameEvent