import { Input } from "../../build/definitions/inputDefinitions";
import { HandlingParam } from "../../build/MinoGame";

export enum InputType {
    Numeric = "number",
    Checkbox = "checkbox",
    Text = "text",
    KeyBinding = "keybinding"
}


export namespace AssociatedValue {

    export type Any = InputType | HandlingType

    export enum Classifier {
        Input,
        Handling
    }
    
    export type InputType = {
        classifier: Classifier.Input,
        value: Input.Any
    }

    export type HandlingType = {
        classifier: Classifier.Handling,
        value: HandlingParam
    }

    export let Input = (value: Input.Any): InputType => {
        return { classifier: Classifier.Input, value }
    }

    export let Handling = (value: HandlingParam): HandlingType => {
        return { classifier: Classifier.Handling, value }
    }

}


export let getKeycodeDisplayValue = (keycode: String) => {
    if (keycode.startsWith("Key")) {
        return keycode.substring(3)
    } else if (keycode.startsWith("Arrow")) {
        return keycode.substring(5)
    }
    return keycode;
}

let defaultSettings: UiSettings = {
    startingRow: 18,
    ceilingRow: 20,
    playfieldBlockSize: 30,
    previewBlockSize: 22,

    settingsForm: [
        {
            heading: "Keybindings",
            defaultInputType: InputType.KeyBinding,
            fields: [
                { label: "Move Left", associatedValue: AssociatedValue.Input(Input.ShiftLeft) },
                { label: "Move Right", associatedValue: AssociatedValue.Input(Input.ShiftRight) },
                { label: "Hard Drop", associatedValue: AssociatedValue.Input(Input.HD) },
                { label: "Rotate Left (CCW)", associatedValue: AssociatedValue.Input(Input.RotateCCW) },
                { label: "Rotate Right (CW)", associatedValue: AssociatedValue.Input(Input.RotateCW) },
                { label: "Rotate 180", associatedValue: AssociatedValue.Input(Input.Rotate180) },
                { label: "Soft Drop", associatedValue: AssociatedValue.Input(Input.SD) },
                { label: "Hold", associatedValue: AssociatedValue.Input(Input.Hold) },
                { label: "Pause", associatedValue: AssociatedValue.Input(Input.Pause) },
                { label: "Restart", associatedValue: AssociatedValue.Input(Input.Restart) }
            ]
        },
        {
            heading: "Handling",
            defaultInputType: InputType.Numeric,
            fields: [
                { label: "DAS", associatedValue: AssociatedValue.Handling(HandlingParam.DAS) },
                { label: "ARR", associatedValue: AssociatedValue.Handling(HandlingParam.ARR) },
                { label: "SDF", associatedValue: AssociatedValue.Handling(HandlingParam.SDF) }
            ]
        }
    ],
    blockColors: [
        "#000000",
        "#00FFFF",
        "#0000FF",
        "#FFAA00",
        "#FFFF00",
        "#00FF00",
        "#AA2288",
        "#FF0000"
    ]
}

export let defaultPrefs: UserPreferences = {
    handling: {
		[HandlingParam.ARR]: 0,
		[HandlingParam.DAS]: 83,
		[HandlingParam.SDF]: 1000
    },

    keybindings: {
        ArrowLeft: Input.ShiftLeft,
        ArrowRight: Input.ShiftRight,
        Space: Input.HD,
        KeyA: Input.RotateCCW,
        KeyD: Input.RotateCW,
        KeyS: Input.Rotate180,
        ArrowDown: Input.SD,
        ShiftLeft: Input.Hold,
        KeyP: Input.Pause,
        KeyR: Input.Restart
    }
}

export default defaultSettings;

export type HandlingPreferences = {
    [HandlingParam.ARR]: number,
    [HandlingParam.DAS]: number,
    [HandlingParam.SDF]: number
}

export type UserPreferences = {
    keybindings: { [key: string]: Input.Any },
    handling: HandlingPreferences
}

export type UiSettings = {
    startingRow: number,
    ceilingRow: number,
    playfieldBlockSize: number,
    previewBlockSize: number,
    settingsForm: FormData,
    blockColors: string[]
}

export type FormData = FormSection[]

export type FormSection = {
    heading: string,
    fields: FormField[],
    defaultInputType: InputType
}

export type FormField = {
    associatedValue: AssociatedValue.Any,
    label: string,
    inputType?: InputType,
    value?: string
}
