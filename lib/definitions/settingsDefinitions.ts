import { LockdownConfig, LockdownPresets } from "./lockdownDefinitions";
import { RotationSystem } from "./rotationDefinitions";

import srs from "../rotationSystems/srs";

export enum Randomization {
    Classic = "Classic",
    Bag = "SevenBag"
}

export type ScoreConfig = {
    comboBonusEnabled: boolean,
    pcBonusEnabled: boolean
}

export type Settings = {
    columns: number,
    rows: number,
    ceilingRow: number,
    ghostEnabled: boolean,
    rotationSystem: RotationSystem,
    dasPreservationEnabled: boolean,
    nextPreviewSize: number,
    randomization: Randomization,
    softDropInterval: number,
    dropInterval: number,
    dasInteruptionEnabled: boolean,
    dasPreIntervalShift: boolean,
    arr: number,
    das: number,
    lockdownConfig: LockdownConfig,
    scoreConfig: ScoreConfig,
}

export namespace SettingsPresets {

    export const Guideline = {
        columns: 10,
        rows: 40,
        ceilingRow: 20,
        ghostEnabled: true,
        rotationSystem: srs,
        dasPreservationEnabled: true,
        nextPreviewSize: 5,
        randomization: Randomization.Bag,
        softDropInterval: 10,
        dropInterval: 500000,
        dasInteruptionEnabled: true,
        dasPreIntervalShift: true,
        arr: 10,
        das: 130,
        lockdownConfig: LockdownPresets.ExtendedPlacement,
        scoreConfig: {
            comboBonusEnabled: true,
            pcBonusEnabled: true
        }
    }  

}