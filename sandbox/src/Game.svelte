<script lang="ts">
    import { onMount } from 'svelte';
    
	import MinoGame from "./MinoGame"
    import Input from "../../build/definitions/Input"
    import GameStatus from "../../build/core/definitions/GameStatus"

    import { getKeycodeDisplayValue } from "./form/forms";
    import { bannerFocusMessage, bannerPauseMessage, bannerGameOverMessage } from "./strings.json";
    import Grid from "./Grid.svelte"
    import prepareQueue from "../../build/core/operations/root/lifecycle/prepareQueue"
    import start from "../../build/core/operations/root/lifecycle/start"
    import operations from "../../build/core/defaultCoreOperations"
    import schemas from "../../build/presets/tetro/tetroSchemaPresets"
    import type Settings from "../../build/settings/definitions/Settings"
    import updateSettings from "../../build/core/operations/root/updateSettings"
    import edit from "../../build/core/operations/root/edit"
    import TetroPiece from "../../build/presets/tetro/TetroPiece";
    import Cell from "../../build/definitions/Cell";

	export let uiSettings: UiSettings
    export let userPrefs: UserPreferences
    export let state: MinoGame.State
    export let reportState: (state: MinoGame.State) => void

    let buildSettings = (userPrefs: UserPreferences) => {
        return {
            dropMechanics: {
                softInterval: userPrefs.sdf,
                autoInterval: 1000
            },
            dasMechanics: {
                delay: userPrefs.das,
                autoShiftInterval: userPrefs.arr,
                interruptionEnabled: userPrefs.dasInterruptionEnabled,
                preservationEnabled: userPrefs.dasPreservationEnabled,
                postDelayShiftEnabled: true
            },
            ghostEnabled: true
        } satisfies Settings
    }

	let game = new MinoGame({ schema: schemas.guideline, operations }, buildSettings(userPrefs))

    game.onStateChanged = reportState
    state = game.init()
    reportState(state)
    game.run(prepareQueue)
    game.run(start)

    let container: HTMLElement
    let containerInFocus = true

    onMount(() => container.focus())

	let onKeydownEvent = (e: KeyboardEvent) => {
        if (e.repeat) { return }
        let input = userPrefs.keybindings[e.code]
        game.startInput(input)
	}

	let onKeyupEvent = (e: KeyboardEvent) => {
		if (e.repeat) { return }
        game.endInput(userPrefs.keybindings[e.code])

        game.run(edit({ partial: { previewQueue: [TetroPiece.I] } }))
	}

    let onFocus = () => containerInFocus = true
    let onBlur = () => containerInFocus = false

    let getDisplayValueForInput = (input: Input) => {
        let keycode = Object.entries(userPrefs.keybindings).find(entry => entry[1] == input)[0]
        return getKeycodeDisplayValue(keycode)
    }

	$: playfieldGrid = state.core.playfield
	$: visiblePlayfieldGrid = playfieldGrid.slice((uiSettings.startingRow || 0) - playfieldGrid.length)
	$: inactiveGame = state.core.status != GameStatus.Active
    $: isPaused = state.core.status === GameStatus.Suspended
    $: game.run(edit({ settings: buildSettings(userPrefs) })) // Updates settings whenever user prefs change
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
        <!-- <Grid
            gridData={state.previewGrids.holdPreview} 
            colors={uiSettings.blockColors} 
            borderlessHeight={state.previewGrids.holdPreview.length}
            blockSize={uiSettings.previewBlockSize}
            dimmed={inactiveGame}
            showBorders={userPrefs.showGrid}
            concealBlocks={isPaused}/> -->
        <Grid 
            gridData={visiblePlayfieldGrid} 
            colors={uiSettings.blockColors} 
            borderlessHeight={uiSettings.ceilingRow-uiSettings.startingRow}
            blockSize={uiSettings.playfieldBlockSize}
            dimmed={inactiveGame}
            showBorders={userPrefs.showGrid}
            concealBlocks={isPaused}/>
        <!-- <Grid
            gridData={state.previewGrids.nextPreview} 
            colors={uiSettings.blockColors} 
            borderlessHeight={state.previewGrids.nextPreview.length}
            blockSize={uiSettings.previewBlockSize}
            dimmed={inactiveGame}
            showBorders={userPrefs.showGrid}
            concealBlocks={isPaused}/> -->
    </div>  
    <div class='banner-container'>
        {#if !containerInFocus && userPrefs.showFocusBanner}
            <div class='banner'>{bannerFocusMessage}</div>  
        {:else if isPaused}
            <div class='banner'>
                {bannerPauseMessage.replace("%%", getDisplayValueForInput(Input.Pause))}
            </div>
        {:else if state.core.status === GameStatus.GameOver}
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