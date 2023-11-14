<script lang="ts">
    import Input from "./Input.svelte";

	export let sections: FormSection[];
    export let onChange: (
        value: string | boolean | number, 
        previousValue: string | boolean | number, 
        associatedKey: any
    ) => void
</script>

<table>
    {#each sections as { heading, entries }}
        <div class="form-section">
            <h3>{heading}</h3>
            {#each entries as { label, associatedKey, field, options }}
                {#if !options.hidden}
                    <tr>
                        <th class="form-label" class:form-label-bold="{options.emphasized}">{label}</th> 
                        <th class="form-input-container">
                            <Input field={field}
                                disabled={options.disabled}
                                onChange={ newValue => onChange(newValue, field.value, associatedKey) }/>
                        </th>
                    </tr>
                {/if}
            {/each}
        </div>

    {/each}
</table>

<style>
    .form-section {
        margin-bottom: 50px;
    }
    .form-label {
        font-size: 14px;
        text-align: right;
        font-weight: normal;
    }
    .form-label-bold {
        font-weight: bold;
    }
    .form-input-container {
        padding-left: 15px;

    }
</style>