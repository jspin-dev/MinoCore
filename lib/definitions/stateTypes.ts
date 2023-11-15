import { ShiftDirection } from "./playfieldDefinitions";
import { Instruction, GameStatus } from "./metaDefinitions";
import { Input } from "./inputDefinitions";
import { Settings } from "./settingsDefinitions";
import { ActivePiece } from "./playfieldDefinitions";
import type { LockdownInfo } from "./lockdownDefinitions";
import type { Immutable } from "immer";
import { Grid } from "./shared/Grid";
import { Score } from "./scoring/Score";

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


export namespace State {

    export let initial: State = {
        playfield: null,
        hold: null,
        preview: null,
        meta: null,
        settings: null,
        statistics: null
    }

}