<script lang="ts">
    import { onMount } from 'svelte'
	import MinoGame from "../../build/MinoGame";
	import type { Settings } from "../../build/definitions/settingsDefinitions";
    import { Input } from "../../build/definitions/inputDefinitions";
    
	import Grid from "./Grid.svelte";
    import { GameStatus } from "../../build/definitions/metaDefinitions";
    import { getKeycodeDisplayValue, UiSettings, UserPreferences } from "./ui";
    import { HandlingParam } from "../../build/MinoGame";
    
	export let uiSettings: UiSettings;
    export let userPrefs: UserPreferences;
    export let settings: Settings;

    let container: HTMLElement;
	let game = new MinoGame();
	let state = game.init(settings);
    let containerInFocus = true;

	game.onStateChanged = s => { state = s }

	setTimeout(() => {
		game.actions.prepareQueue();
		setTimeout(() => {
			game.actions.start();
		}, 1000);
	}, 2000)
	
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
	$: previewGrid = state.preview.grid;
	$: holdGrid = state.hold.grid;
	$: inactiveGame = state.meta.status != GameStatus.Active;
    $: isPaused = state.meta.status === GameStatus.Suspended;
    $: {
        game.setSDF(userPrefs.handling[HandlingParam.SDF])
        game.setDAS(userPrefs.handling[HandlingParam.DAS]);
        game.setARR(userPrefs.handling[HandlingParam.ARR]);
    }
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
            gridData={holdGrid} 
            colors={uiSettings.blockColors} 
            borderlessHeight={holdGrid.length}
            blockSize={uiSettings.previewBlockSize}
            dimmed={inactiveGame}
            concealed={isPaused}/>
        <Grid 
            gridData={visiblePlayfieldGrid} 
            colors={uiSettings.blockColors} 
            borderlessHeight={uiSettings.ceilingRow-uiSettings.startingRow}
            blockSize={uiSettings.playfieldBlockSize}
            dimmed={inactiveGame}
            concealed={isPaused}/>
        <Grid
            gridData={previewGrid} 
            colors={uiSettings.blockColors} 
            borderlessHeight={previewGrid.length}
            blockSize={uiSettings.previewBlockSize}
            dimmed={inactiveGame}
            concealed={isPaused}/>
    </div>  
    <div class='banner-container'>
        {#if !containerInFocus}
            <div class='banner'>Click here to return focus</div>  
        {:else if isPaused}
            <div class='banner'>Paused (Press {getDisplayValueForInput(Input.Pause)} to resume)</div>  
        {:else if state.meta.status.classifier === GameStatus.Classifier.GameOver}
            <div class='banner'>Game Over (Press {getDisplayValueForInput(Input.Restart)} to restart)</div>  
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
    }
</style>