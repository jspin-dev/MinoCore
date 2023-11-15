import { Coordinate } from "./playfieldDefinitions";

import type { Immutable } from "immer";
import { Grid } from "./shared/Grid";

export enum Orientation {
    North = 0,
    East = 1,
    South = 2,
    West = 3
}

export enum Rotation {
    CW = 1,
    CCW = -1,
    Degrees180 = 2
}

export type RotationSystem = Immutable<{
    startLocations: StartLocationInfo[],
    shapes: Grid[],
    rotationStateInfo: RotationStateInfo[],
    kickTables: KickTableGroup[],
    previewGrids?: Grid[], // Optional, generated in runtime
    rotationGrids?: RotationGridSet[] // Optional, generated in runtime
}>

export type StartLocationInfo = Immutable<{
    pieces: number[],
    location: Coordinate
}>

export type RotationGridSet = {
    [key: number]: Grid
}

export type KickTableGroup = Immutable<{
    pieces: number[],
    tables: KickTable
}>

export type KickTable = Immutable<{ 
    [key: number]: {
        [key: number]: KickOffsetList
    } 
}>
export type KickOffsetList = Offset[]

export type Offset = [number, number]

export type RotationStateInfo = Immutable<{
     pieces: number[],
     states: {
        [Orientation.North]: RotationState,
        [Orientation.East]: RotationState,
        [Orientation.South]: RotationState,
        [Orientation.West]: RotationState
    }
}>

export type RotationState = Immutable<{
    pureRotationIndex: number,
    offset?: Offset
}>