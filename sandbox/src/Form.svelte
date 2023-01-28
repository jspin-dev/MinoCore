<script lang="ts">
    import type { AssociatedValue, FormData } from "./ui";
    import Input from "./Input.svelte";

	export let data: FormData;
    export let onChange: (value: string, previousValue: string, associatedValue: AssociatedValue.Any) => void
</script>

<table>
    {#each data as { heading, fields, defaultInputType }}
        <h2>{heading}</h2>
        {#each fields as { label, value, inputType, associatedValue }}
            <tr>
                <th class="form-label">{label}</th> 
                <th class="form-input-container">
                    <Input value={value}
                        onChange={ newValue => onChange(newValue, value, associatedValue) }
                        inputType={inputType || defaultInputType}/>
                </th>
            </tr>
        {/each}
    {/each}
</table>

<style>
    .form-label {
        font-size: 14px;
        text-align: right;
        font-weight: normal;
    }
    .form-input-container {
        padding-left: 15px;
    }
</style>