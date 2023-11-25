<script lang="ts">
    import Game from "./Game.svelte";
	import Form from "./Form.svelte";
	import { SettingsPresets } from "../../build/definitions/settingsDefinitions";
	import { defaultSettings } from "./ui";
	import { presets as userPrefPresets } from "./config/userPrefs";
    import { UserPrefsAssociatedKey, userPrefsForm as baseUserPrefsForm } from "./form/userPrefsForm";
    import { produce } from "immer";
    import StatsTable from "./stats/StatsTable.svelte";
    import { buildStatsSection } from "./stats/statsUtil";
    import type { State } from "../../build/definitions/stateTypes";

	let userPrefs = userPrefPresets.alternate;
	let gameState: State;

	let onUserPrefsChanged = (
		value: string | boolean | number, 
		previousValue:  string | boolean | number, 
		associatedKey: UserPrefsAssociatedKey.Any
	) => {
		switch (associatedKey.classifier) {
			case UserPrefsAssociatedKey.Classifier.GameInput:
				userPrefs.keybindings[previousValue as string] = userPrefs.keybindings[value as string];
				userPrefs.keybindings[value as string] = associatedKey.value;
				break;
			case UserPrefsAssociatedKey.Classifier.GameInputPreset:
				userPrefs.keybindings = userPrefPresets[value as string]
				break;
			case UserPrefsAssociatedKey.Classifier.Main:
				userPrefs[associatedKey.value] = value;

		}
	}

	$: userPrefsForm = baseUserPrefsForm.map(section => {
		return {
			...section,
			entries: section.entries.map(entry => {
				switch (entry.associatedKey.classifier) {
					case UserPrefsAssociatedKey.Classifier.GameInput:
						let input = entry.associatedKey.value;
						return produce(entry, draft => {
							draft.field.value = Object.entries(userPrefs.keybindings)
								.find(keybinding => keybinding[1] === input)[0];
						});
					case UserPrefsAssociatedKey.Classifier.GameInputPreset:
						return produce(entry, draft => {
							let match = Object.entries(userPrefPresets)
								.find(preset => preset[1].keybindings == userPrefs.keybindings)[0]
							draft.field.value = match || "custom"
						});
					case UserPrefsAssociatedKey.Classifier.Main:
						return produce(entry, draft => {
							draft.field.value = userPrefs[entry.associatedKey.value];
						});
				}
			})
		}
	});

	$: statistics = gameState ? gameState.statistics : null
	$: actionTally = statistics ? statistics.actionTally : null
	$: statsSection = buildStatsSection(statistics)
</script>

<main class="main">
	{#if statistics}
		<div class="stats-container">
			<h3>{statsSection.sectionName}</h3>
			<div class="stats-section">
				{#each statsSection.tables as tableInfo}
					<StatsTable entries={tableInfo}/>
				{/each}
			</div>
		</div>
	{/if}

	<Game 
		gameSettings={SettingsPresets.Guideline} 
		uiSettings={defaultSettings} 
		userPrefs={userPrefs}
		reportState={state => gameState = state}
		state={gameState}/>
	<Form 
		sections={userPrefsForm}
		onChange={onUserPrefsChanged}/>
</main>

<style>
	.main {
		display: flex;
		align-items: flex-start;
		gap: 40px;
	}
	.stats-container {
		padding: 15px;
	}

	.stats-section {
		display: flex;
		align-items: flex-start;
	}
</style>