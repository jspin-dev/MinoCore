import type Input from "../../build/definitions/Input";
import type { InputField, FormEntry } from "./form/forms";

declare global {

    export type BasicStat = BasicStat.ScoreStateType | BasicStat.NumberType | BasicStat.FormattedTimeType

    export type UserPreferences = {
        keybindings: { [key: string]: Input },
        das: number,
        arr: number,
        sdf: number,
        ghostEnabled: boolean,
        dasPreservationEnabled: boolean,
        dasInterruptionEnabled: boolean,
        showGrid: boolean,
        showFocusBanner: boolean
    }

    export type FormSection = {
        heading: string,
        entries: FormEntry<any>[]
    }

    export type FormEntry<K> = {
        label: string,
        associatedKey: K,
        field: InputField,
        options: FormEntry.Options
    }

    export type StatsEntry = {
        label: string,
        value: string
    }

    export type UiSettings = {
        startingRow: number,
        ceilingRow: number,
        playfieldBlockSize: number,
        previewBlockSize: number,
        userPrefsForm: FormSection[],
        blockColors: string[]
    }
}

export namespace BasicStat {

    export enum Classifier {
        FormattedTime,
        ScoreState,
        Number
    }

    // Types
    export type FormattedTimeType = { type: Classifier.FormattedTime }
    export type ScoreStateType = { type: Classifier.ScoreState, key: string }
    export type NumberType = { type: Classifier.Number, key: string, decimalPlaces?: number }

    // Values
    export let FormattedTime: FormattedTimeType = { type: Classifier.FormattedTime }
    export let ScoreState = (key: string): ScoreStateType => { 
        return { type: Classifier.ScoreState, key } 
    }
    export let Number = (key: string, decimalPlaces?: number): NumberType => { 
        return { type: Classifier.Number, key, decimalPlaces } 
    }

}
