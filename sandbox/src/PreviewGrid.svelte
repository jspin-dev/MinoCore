<script lang="ts">
    import GridBuilder from "../../build/addons/gridBuilder/definitions/GridBuilder"
    import type Grid from "../../lib/definitions/Grid"

    export let blockSize = 20
    export let dimmed = false
    export let gridData: Grid<GridBuilder.Cell> = []
    export let colors: String[] = []
    export let showBorders = true
    export let concealBlocks = false

    let colorFor = (cell: GridBuilder.Cell): String => {
        if (concealBlocks) { return colors[0] }
        return colors[cell.classifier == GridBuilder.Cell.Classifier.Empty ? 0 : cell.pieceId as number]
    }
</script>

<div class='grid' class:dimmed={dimmed}>
    {#each gridData as row}
        <div class='row'>
            {#each row as cell}
                <div class='block'
                     class:blank-border="{showBorders}"
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
        width: 20px;
        height: 20px;
    }
    .blank-border {
        border-right: 1px solid #000000;
        border-bottom: 1px solid #000000;
    }
    .dimmed {
        filter: brightness(40%)
    }
</style>