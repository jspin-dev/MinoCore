import { ShiftDirection } from "./playfieldDefinitions";
import { Instruction, GameStatus } from "./metaDefinitions";
import { Input } from "./inputDefinitions";
import { Settings } from "./settingsDefinitions";
import { ActivePiece } from "./playfieldDefinitions";
import { Grid } from "./sharedDefinitions";
import type { LockdownInfo } from "./lockdownDefinitions";

import type { Immutable } from "immer";

export type Playfield = Immutable<{
    activePiece: ActivePiece,
    grid: Grid,
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
    status: GameStatus.Any,
    previousStatus: GameStatus.Any,
    activeInputs: Input.ActiveGame[],
    instantSoftDropActive: boolean,
    dasRightCharged: boolean,
    dasLeftCharged: boolean,
    direction: ShiftDirection,
    pendingInstructions: Instruction[],
    lastInstructionId: number
}>

export type State = Immutable<{
    playfield: Playfield,
    hold: Hold,
    preview: Preview,
    meta: Meta,
    settings: Settings
}>
