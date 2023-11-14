export namespace Checkbox {

    export let YesNoPreset = {
        checkedText: "Yes",
        uncheckedText: "No"
    }

    export let EnabledDisabledPreset = {
        checkedText: "Enabled",
        uncheckedText: "Disabled"
    }

    export type Params = {
        checkedText?: string,
        uncheckedText?: string
    }

}

export namespace Dropdown {

    export type Option = {
        text: string,
        value: string
    }

}

export namespace InputField {

    export type Any = TextType | KeybindingType | CheckboxType | NumericRangeType | DropdownType

    export enum Classifier {
        Text,
        Keybinding,
        Checkbox,
        NumericRange,
        Dropdown
    }

    export type TextType = {
        classifier: Classifier.Text,
        params: TextParams,
        value?: string
    }

    export type KeybindingType = {
        classifier: Classifier.Keybinding,
        value?: string
    }

    export type CheckboxType = {
        classifier: Classifier.Checkbox,
        params: Checkbox.Params,
        value?: boolean
    }

    export type TextParams = {
        allowedCharacters?: string,
        forceCaps?: boolean
    }

    export type NumericRangeParams = {
        min: number, 
        max: number, 
        hint?: string
    }

    export type NumericRangeType = {
        classifier: Classifier.NumericRange,
        params: NumericRangeParams,
        value?: number
    }

    export type DropdownType = {
        classifier: Classifier.Dropdown,
        options: Dropdown.Option[],
        value?: string
    }
    
    export let Keybinding: KeybindingType = { classifier: Classifier.Keybinding }

    export let Text = (params: TextParams): TextType => {
        return { classifier: Classifier.Text, params }
    }

    export let Checkbox = (params: Checkbox.Params): CheckboxType => {
        return { classifier: Classifier.Checkbox, params }
    }

    export let NumericRange = (params: NumericRangeParams): NumericRangeType => {
        return { classifier: Classifier.NumericRange, params }
    }

    export let Dropdown = (options: Dropdown.Option[]): DropdownType => {
        return { classifier: Classifier.Dropdown, options }
    }

}

export namespace FormEntry {

    export type Options = {
        disabled?: boolean,
        emphasized?: boolean,
        hidden?: boolean
    }

    export let DefaultOptions = {
        disabled: false,
        emphasized: false,
        hidden: false
    }

}

export let getKeycodeDisplayValue = (keycode: string) => {
    if (keycode.startsWith("Key")) {
        return keycode.substring(3)
    } else if (keycode.startsWith("Arrow")) {
        return keycode.substring(5)
    }
    return keycode;
}
