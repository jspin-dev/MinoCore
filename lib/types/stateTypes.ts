import { ShiftDirection } from "../definitions/playfieldDefinitions";
import { Instruction, GameStatus } from "../definitions/metaDefinitions";
import { Input } from "../definitions/inputDefinitions";
import { Settings } from "../definitions/settingsDefinitions";
import { ActivePiece } from "../definitions/playfieldDefinitions";
import type { LockdownInfo } from "../definitions/lockdownDefinitions";
import type { Grid } from "./sharedTypes";
import type { Immutable } from "immer";

export type Playfield = Immutable<{
    activePiece: ActivePiece,
    grid: Grid,
    spinSnapshot: Grid,
    lockdownInfo: LockdownInfo
}>

export type Hold = Immutable<{
    enabled: boolean,
    pieceId: number,
    grid: Grid
}>

export type Preview = Immutable<{
    queue: number[],
    grid: Grid,
    dequeuedPiece: number,
    randomNumbers: number[]
}>

export type Meta = Immutable<{
    status: GameStatus,
    previousStatus: GameStatus,
    activeInputs: Input.ActiveGame[],
    softDropActive: boolean,
    dasRightCharged: boolean,
    dasLeftCharged: boolean,
    direction: ShiftDirection,
    pendingInstructions: Instruction[],
    lastInstructionId: number
}>

export type StepCounts = {
    drop: number,
    rotate: number,
    shift: number,
    hold: number
}

export type Statistics = Immutable<{
    scoreState: Score.State,
    level: number,
    actionTally: {[key: string]: number},
    lines: number,
    keysPressed: number,
    piecesLocked: number,
    time: number,
    pps: number,
    kpp: number,
    steps: StepCounts,
    finesse: number
}>

export type State = Immutable<{
    playfield: Playfield,
    hold: Hold,
    preview: Preview,
    meta: Meta,
    settings: Settings,
    statistics: Statistics
}> 