<script lang="ts">
    import { onMount } from 'svelte'
	import MinoGame from "../../build/MinoGame";
	import type { Settings } from "../../build/definitions/settingsDefinitions";
    import { Input } from "../../build/definitions/inputDefinitions";
    
	import Grid from "./Grid.svelte";
    import { GameStatus } from "../../build/definitions/metaDefinitions";
    import { getKeycodeDisplayValue } from "./form/forms";

    import { bannerFocusMessage, bannerPauseMessage, bannerGameOverMessage } from "./strings.json";
    import type { State } from '../../build/definitions/stateTypes';
    import guidelineDependencies from "../../build/dependencies/guidelineDependencies";

	export let uiSettings: UiSettings;
    export let userPrefs: UserPreferences;
    export let gameSettings: Settings;
    export let state: State;
    export let reportState: (state: State) => void;

	let game = new MinoGame(guidelineDependencies(gameSettings));
	game.onStateChanged = reportState;
	state = game.init();
    reportState(state);
    game.run(ops => ops.prepareQueue);
    game.run(ops => ops.start);

    let container: HTMLElement;
    let containerInFocus = true;

    onMount(() => container.focus());

	let onKeydownEvent = (e: KeyboardEvent) => {
        if (e.repeat) { return }
        game.startInput(userPrefs.keybindings[e.code]);
	}

	let onKeyupEvent = (e: KeyboardEvent) => {
		if (e.repeat) { return }
        game.endInput(userPrefs.keybindings[e.code]);
	}

    let onFocus = () => containerInFocus = true
    let onBlur = () => containerInFocus = false

    let getDisplayValueForInput = (input: Input.Any) => {
        let keycode = Object.entries(userPrefs.keybindings).find(entry => entry[1] == input)[0];
        return getKeycodeDisplayValue(keycode)
    }

	$: playfieldGrid = state.playfield.grid;
	$: visiblePlayfieldGrid = playfieldGrid.slice((uiSettings.startingRow || 0) - playfieldGrid.length);
	$: inactiveGame = state.meta.status != GameStatus.Active;
    $: isPaused = state.meta.status === GameStatus.Suspended;
    
    $: game.run(ops => ops.setSDF(userPrefs.sdf));
    $: game.run(ops => ops.setDAS(userPrefs.das));
    $: game.run(ops => ops.setARR(userPrefs.arr));
    $: game.run(ops => ops.setGhostEnabled(userPrefs.ghostEnabled));
</script>

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->

<div class='main-container' 
    tabindex="0" 
    bind:this={container}
    on:keydown={onKeydownEvent} 
    on:keyup={onKeyupEvent} 
    on:focus={onFocus}
    on:blur={onBlur}>
    <div class='game-container'>
        <Grid
            gridData={state.hold.grid} 
            colors={uiSettings.blockColors} 
            borderlessHeight={state.hold.grid.length}
            blockSize={uiSettings.previewBlockSize}
            dimmed={inactiveGame}
            showBorders={userPrefs.showGrid}
            concealBlocks={isPaused}/>
        {#key state.playfield}
            <Grid 
                gridData={visiblePlayfieldGrid} 
                colors={uiSettings.blockColors} 
                borderlessHeight={uiSettings.ceilingRow-uiSettings.startingRow}
                blockSize={uiSettings.playfieldBlockSize}
                dimmed={inactiveGame}
                showBorders={userPrefs.showGrid}
                concealBlocks={isPaused}/>
        {/key}
        <Grid
            gridData={state.preview.grid} 
            colors={uiSettings.blockColors} 
            borderlessHeight={state.preview.grid.length}
            blockSize={uiSettings.previewBlockSize}
            dimmed={inactiveGame}
            showBorders={userPrefs.showGrid}
            concealBlocks={isPaused}/>
    </div>  
    <div class='banner-container'>
        {#if !containerInFocus && userPrefs.showFocusBanner}
            <div class='banner'>{bannerFocusMessage}</div>  
        {:else if isPaused}
            <div class='banner'>
                {bannerPauseMessage.replace("%%", getDisplayValueForInput(Input.Pause))}
            </div>
        {:else if state.meta.status.classifier === GameStatus.Classifier.GameOver}
            <div class='banner'>
                {bannerGameOverMessage.replace("%%", getDisplayValueForInput(Input.Restart))}
            </div>  
        {/if}
    </div>
</div>

<style>
    div:focus {
        outline: none;
    }
    .main-container {
        position: relative;
    }
    .banner-container {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 100%;
		display: flex;
        flex-direction: column;
        justify-content: center;
        z-index: 10000;
        gap: 20px;
    }
	.game-container {
		display: flex;
		justify-content: center;
		margin-top: 30px;
	}
    .banner {
        width: 100%;
        height: 50px;
        background-color: #eeeeee;
        display: flex;
		align-items: center;
        justify-content: center;
        opacity: 0.8;
        color: black;
        user-select: none;
    }
</style>