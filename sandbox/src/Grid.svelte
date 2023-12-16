<script lang="ts">
    import Cell from "../../build/definitions/Cell";
    import type Grid from "../../build/definitions/Grid";

    export let blockSize = 30;
    export let dimmed = false;
    export let gridData: Grid<Cell> = [];
    export let colors: String[] = [];
    export let borderlessHeight = 0;
    export let showBorders = true;
    export let concealBlocks = false;

    let colorFor = (cell: Cell): String => {
        if (concealBlocks) { return colors[0] }
        switch (cell.classifier) {
            case Cell.Classifier.Mino:
                return colors[cell.piece as number];
            case Cell.Classifier.Empty:
                return colors[0];
        }
    }
</script>

<div class='grid' class:dimmed={dimmed}>
    {#each gridData as row, i}
    <div class='row'>
        {#each row as cell}
            <div class='block' 
                class:game-block-bordered="{showBorders && i >= borderlessHeight}"
                class:game-block-bottom-bordered="{showBorders && i == borderlessHeight-1}"
                class:blank-border="{showBorders && i < borderlessHeight}"
                class:dimmed="{cell.classifier == Cell.Classifier.Mino && cell.ghost}" 
                style="--block-color: {colorFor(cell)}; 
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
		filter: brightness(40%)
	}
</style>