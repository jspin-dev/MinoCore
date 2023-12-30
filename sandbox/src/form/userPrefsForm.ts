import GameInput from "../../../build/definitions/Input";
import { InputField, Checkbox, Dropdown, FormEntry } from "./forms";

export namespace UserPrefsAssociatedKey {

    export type Any = GameInputType | GameInputPresetType | MainType

    export enum Classifier {
        GameInput,
        GameInputPreset,
        Main
    }
    
    export type GameInputType = {
        classifier: Classifier.GameInput,
        value: GameInput
    }

    export type GameInputPresetType = {
        classifier: Classifier.GameInputPreset
    }

    export type MainType = {
        classifier: Classifier.Main,
        value: string
    }

    export let GameInput = (value: GameInput): GameInputType => {
        return { classifier: Classifier.GameInput, value }
    }

    export let GameInputPreset = { classifier: Classifier.GameInputPreset }

    export let Main = (value: string): MainType => {
        return { classifier: Classifier.Main, value }
    }

}

// Util for creating new entries with boilerplate
namespace Entry {

    export let Keybinding = (
        label: string, 
        gameInput: GameInput, 
        options: FormEntry.Options = FormEntry.DefaultOptions
    ) => {
        return { 
            label, 
            associatedKey: UserPrefsAssociatedKey.GameInput(gameInput), 
            field: InputField.Keybinding,
            options
        }
    }
    
    export let KeybindingPreset = (
        label: string, 
        options: Dropdown.Option[], 
        optionalParams: FormEntry.Options = FormEntry.DefaultOptions
    ) => {
        return { 
            label, 
            associatedKey: UserPrefsAssociatedKey.GameInputPreset, 
            field: InputField.Dropdown(options),
            options: optionalParams
        }
    }

    export let MainNumeric = (
        label: string, 
        key: string,
        rangeParams: InputField.NumericRangeParams,
        options: FormEntry.Options = FormEntry.DefaultOptions
    ) => {
        return { 
            label, 
            associatedKey: UserPrefsAssociatedKey.Main(key), 
            field: InputField.NumericRange(rangeParams),
            options
        }
    }

    export let MainCheckbox = (
        label: string, 
        key: string, 
        checkboxParams: Checkbox.Params,
        options: FormEntry.Options = FormEntry.DefaultOptions
    ) => {
        return {
            label,
            associatedKey: UserPrefsAssociatedKey.Main(key),
            field: InputField.Checkbox(checkboxParams),
            options
        }
    }
}

export let userPrefsForm: FormSection[] = [
    {
        heading: "Keybindings",
        entries: [
            // TODO: Fix this
            // Entry.KeybindingPreset("Preset", [
            //     { text: "Default", value: "default" },
            //     { text: "J-Spin", value: "alternate" },
            //     { text: "Custom", value: "custom" }
            // ], { emphasized: true }),
            Entry.Keybinding("Move Left", GameInput.ShiftLeft),
            Entry.Keybinding("Move Right", GameInput.ShiftRight),
            Entry.Keybinding("Hard Drop", GameInput.HD),
            Entry.Keybinding("Rotate Left (CCW)", GameInput.RotateCCW),
            Entry.Keybinding("Rotate Right (CW)", GameInput.RotateCW),
            Entry.Keybinding("Rotate 180", GameInput.Rotate180),
            Entry.Keybinding("Soft Drop", GameInput.SD),
            Entry.Keybinding("Hold", GameInput.Hold),
            Entry.Keybinding("Pause", GameInput.Pause),
            Entry.Keybinding("Restart", GameInput.Restart)
            
        ]
    },
    {
        heading: "Handling",
        entries: [
            Entry.MainNumeric("DAS", "das", { min: 0, max: 500 }),
            Entry.MainNumeric("ARR", "arr", { min: 0, max: 50 }),
            Entry.MainNumeric("SDF", "sdf", { min: 0, max: 50 }),
            Entry.MainCheckbox("DAS preservation", "dasPreservationEnabled", Checkbox.EnabledDisabledPreset),
            Entry.MainCheckbox("DAS interruption", "dasInterruptionEnabled", Checkbox.EnabledDisabledPreset)
        ]
    },
    {
        heading: "Style",
        entries: [
            Entry.MainCheckbox("Show ghost piece", "ghostEnabled", Checkbox.YesNoPreset),
            Entry.MainCheckbox("Show grid", "showGrid", Checkbox.YesNoPreset),
            Entry.MainCheckbox("Show focus banner", "showFocusBanner", Checkbox.YesNoPreset)
        ]
    }
]

