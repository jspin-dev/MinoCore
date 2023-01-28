<script lang="ts">
    import type { Grid } from "../../build/definitions/sharedDefinitions";

    export let blockSize = 30;
    export let dimmed = false;
    export let gridData: Grid = [];
    export let colors: String[] = [];
    export let borderlessHeight = 0;
    export let concealed = false;
</script>

<div class='grid' class:dimmed={dimmed}>
    {#each gridData as row, i}
    <div class='row'>
        {#each row as pieceId}
            <div class='block' 
                class:game-block-bordered="{i >= borderlessHeight}"
                class:game-block-bottom-bordered="{i == borderlessHeight-1}"
                class:blank-border="{i < borderlessHeight}"
                class:dimmed="{pieceId < 0}" 
                style="--block-color: {colors[concealed ? 0 : Math.abs(pieceId)]}; 
                       --block-size: {blockSize}px"/>
        {/each}
    </div>
    {/each}
</div>

<style>
    .grid {
        padding-left: 5px;
        padding-right: 5px;
    }
	.row {
		display: flex;
	}

    .block {
        background-color: var(--block-color);
        width: var(--block-size);
		height: var(--block-size);
    }

    .blank-border {
		border-right: 1px solid #000000;
        border-bottom: 1px solid #000000;
    }

    .game-block-bordered {
        border-right: 1px solid #444444;
        border-bottom: 1px solid #444444;
    }

    .game-block-bottom-bordered {
        border-bottom: 1px solid #444444;
    }

	.dimmed {
		filter: brightness(50%)
	}
</style>