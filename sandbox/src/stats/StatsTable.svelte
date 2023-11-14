<script lang="ts">
    export let entries: StatsEntry[];
</script>

<table class="stats-table">
    {#each entries as { label, value }}
        <tr>
            <th class="stats-label">{label}</th> 
            <th class="stats-value">{value}</th>
        </tr>
    {/each}
</table>

<style>
	.stats-table {
		margin-right: 50px;
	}

    .stats-label {
        font-size: 14px;
        text-align: left;
        font-weight: normal;
		padding: 6px 15px 6px 8px;
    }

	.stats-value {
        font-size: 14px;
        text-align: left;
        font-weight: normal;
		padding: 6px 8px 6px 8px;
    }
</style>