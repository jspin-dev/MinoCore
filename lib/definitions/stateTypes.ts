import { Coordinate, ShiftDirection } from "./playfieldDefinitions";
import { GameStatus } from "./metaDefinitions";
import { Input } from "./inputDefinitions";
import { ActivePiece } from "./playfieldDefinitions";
import type { LockdownInfo } from "./lockdownDefinitions";
import type { Immutable } from "immer";
import { Grid } from "./shared/Grid";
import { Offset, Orientation } from "./rotationDefinitions";
import PendingMovement from "./PendingMovement";

/**
 * Implementation Providers:
 * - Queuing Strategy: n-bag, Classic
 * 
 * State Plugins:
 * - CoreStatistics - tracks basic stats that should apply to all block-stacking games
 * - SRStatistics - tracks basic stats (ie finesse, scoring, and leveling) for SRS quad games 
 * - PreviewGridBuilder - utility that builds grids for the next/hold queues similar to that of the playfield, ready to be rendered
 */

export type KickInfo = {
    newOrientation: Orientation,
    matchingOffset?: Offset,
    unadjustedCoordinates?: Coordinate[]
}

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
    randomNumbers: number[]
}>

export type Meta = Immutable<{
    status: GameStatus,
    activeInputs: Input.ActiveGame[],
    activeLeftShiftDistance: number,
    activeRightShiftDistance: number,
    activeDropDistance: number,
    pendingMovement?: PendingMovement,
    softDropActive: boolean,
    dasRightCharged: boolean,
    dasLeftCharged: boolean,
    direction: ShiftDirection
}>
