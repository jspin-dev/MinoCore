<script lang="ts">
	import MinoGame from "../../build/MinoGame";
	import { SettingsPresets } from "../../build/definitions/settingsDefinitions";
	import Grid from "./Grid.svelte";
	import uiSettings from "./ui";
    import { GameStatus } from "../../build/definitions/metaDefinitions";

	let { keybindings } = uiSettings;

	let game = new MinoGame();
	let state = game.init({
		...SettingsPresets.Guideline,
		arr: 0,
		das: 83,
		softDropInterval: 0
	});

	game.onStateChanged = s => { state = s }

	setTimeout(() => {
		game.actions.prepareQueue();
		setTimeout(() => {
			game.actions.start();
		}, 1000);
	}, 2000)

	window.addEventListener('keydown', e => {
		if (!e.repeat) {
			if (e.code in keybindings.activeGame) {
				game.startActiveGameInput(keybindings.activeGame[e.code]);
			} else if (e.code in keybindings.lifecycle) {
				game.onLifecycleInput(keybindings.lifecycle[e.code]);
			}
		}
	});

	window.addEventListener('keyup', e => {
		if (!e.repeat && e.code in keybindings.activeGame) {
			game.endActiveGameInput(keybindings.activeGame[e.code]);
		}
	});

	$: playfieldGrid = state.playfield.grid;
	$: visiblePlayfieldGrid = playfieldGrid.slice((uiSettings.startingRow || 0) - playfieldGrid.length);
	$: previewGrid = state.preview.grid;
	$: holdGrid = state.hold.grid;
	$: inactiveGame = state.meta.status != GameStatus.Active;
</script>

<main>
	<div class='game-container'>
		<Grid
			gridData={holdGrid} 
			colors={uiSettings.blockColors} 
			borderlessHeight={holdGrid.length}
			blockSize={uiSettings.previewBlockSize}
			dimmed={inactiveGame}/>
		<Grid 
			gridData={visiblePlayfieldGrid} 
			colors={uiSettings.blockColors} 
			borderlessHeight={uiSettings.ceilingRow-uiSettings.startingRow}
			blockSize={uiSettings.playfieldBlockSize}
			dimmed={inactiveGame}/>
		<Grid
			gridData={previewGrid} 
			colors={uiSettings.blockColors} 
			borderlessHeight={previewGrid.length}
			blockSize={uiSettings.previewBlockSize}
			dimmed={inactiveGame}/>
	</div>
</main>

<style>
	.game-container {
		display: flex;
		justify-content: center;
		margin-top: 30px;
	}
</style>