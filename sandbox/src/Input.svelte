<script lang="ts">
    import { InputType, getKeycodeDisplayValue } from "./ui";
    export let inputType: InputType;
    export let value: string;
    export let onChange: (value: string) => void

    let textChanged = (event: Event) => {
        const target = event.target as HTMLInputElement;
        onChange(target.value)
    }

    $: sanitizedValue = value === undefined ? "" : value
</script>

<div>
    {#if inputType === InputType.KeyBinding }
        <input value={getKeycodeDisplayValue(sanitizedValue)}
            on:keypress={ e => e.preventDefault() }
            on:keydown= { key => onChange(key.code) }/>
    {:else}
        <input value={sanitizedValue}
            type={inputType}
            on:input={textChanged}/>
    {/if}
</div>