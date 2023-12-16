<script lang="ts">
    import { InputField, getKeycodeDisplayValue } from "./form/forms";
    export let field: InputField;
    export let disabled: boolean = false;
    export let onChange: (value: string | boolean | number) => void

    let onTextChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        onChange(target.value);
    }

    let onNumberChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        onChange(Number(target.value));
    }

    let onCheckboxChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        onChange(target.checked);
    }

</script>

<div>
    {#if field.classifier === InputField.Classifier.Keybinding}
        <input 
            disabled={disabled} 
            value={getKeycodeDisplayValue(field.value === undefined ? "" : field.value)}
            on:keypress={ e => e.preventDefault() }
            on:keydown={ key => onChange(key.code) }/>
    {:else if field.classifier === InputField.Classifier.Text}
        <input 
            disabled={disabled} 
            value={field.value === undefined ? "" : field.value} 
            on:input={onTextChange}/>
    {:else if field.classifier === InputField.Classifier.NumericRange}
        <input 
            disabled={disabled} 
            value={field.value === undefined ? "" : String(field.value)} 
            on:input={onNumberChange}/>
    {:else if field.classifier === InputField.Classifier.Checkbox}
       <div class="checkbox">
            <input type="checkbox" 
                disabled={disabled} 
                checked={field.value} 
                on:change={onCheckboxChange}/>
            <div class="checkbox-hint">
                {field.value ? field.params.checkedText : field.params.uncheckedText}
            </div>
       </div>
    {:else if field.classifier === InputField.Classifier.Dropdown}
       <select value={field.value}>
            {#each field.options as { text, value }}
                <option value={value}>{text}</option>
            {/each}
            
       </select>
    {/if}
</div>

<style>
    .checkbox {
        display: flex;
		justify-content: left;
        gap: 5px;  
    }
    .checkbox-hint {
        font-size: 14px;
        text-align: right;
        font-weight: normal;
    }
</style>