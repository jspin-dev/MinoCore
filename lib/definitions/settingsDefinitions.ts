import { LockdownConfig, LockdownPresets } from "./lockdownDefinitions";
import { RotationSystem } from "./rotationDefinitions";

import type { Immutable } from "immer";
import srs from "../rotationSystems/srs";

export enum Randomization {
    Classic = "Classic",
    Bag = "SevenBag"
}

export type Settings = Immutable<{
    columns: number,
    rows: number,
    ceilingRow: number,
    ghostEnabled: boolean,
    rotationSystem: { [key: number]: RotationSystem }, // TODO fix this temp fix that uses an object with one rotation system
    dasPreservationEnabled: boolean,
    nextPreviewSize: number,
    randomization: Randomization,
    softDropInterval: number,
    dropInterval: number,
    dasInteruptionEnabled: boolean,
    dasPreIntervalShift: boolean,
    arr: number,
    das: number,
    lockdownConfig: LockdownConfig
}>

export namespace SettingsPresets {

    export const Guideline = {
        columns: 10,
        rows: 40,
        ceilingRow: 20,
        ghostEnabled: true,
        rotationSystem: { 0: srs },
        dasPreservationEnabled: true,
        nextPreviewSize: 5,
        randomization: Randomization.Bag,
        softDropInterval: 10,
        dropInterval: 1000,
        dasInteruptionEnabled: true,
        dasPreIntervalShift: true,
        arr: 10,
        das: 130,
        lockdownConfig: LockdownPresets.ExtendedPlacement
    }  

}