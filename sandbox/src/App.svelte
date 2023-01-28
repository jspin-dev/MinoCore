<script lang="ts">
    import Game from "./Game.svelte";
	import Form from "./Form.svelte";
	import { SettingsPresets } from "../../build/definitions/settingsDefinitions";
	import uiSettings, {  defaultPrefs, AssociatedValue, FormField, UserPreferences } from "./ui";

	let userPrefs = defaultPrefs;

	let mapFieldValue = (userPrefs: UserPreferences, field: FormField): string => {
		switch (field.associatedValue.classifier) {
			case AssociatedValue.Classifier.Input:
				let input = field.associatedValue.value;
				return Object.entries(userPrefs.keybindings).find(entry => entry[1] === input)[0];
			case AssociatedValue.Classifier.Handling:
				let handling = field.associatedValue.value;
				return userPrefs.handling[handling].toString();
		}
	}

	let onFormDataChanged = (value, previousValue, associatedValue) => {
		switch (associatedValue.classifier) {
			case AssociatedValue.Classifier.Input:
				userPrefs.keybindings[previousValue] = userPrefs.keybindings[value];
				userPrefs.keybindings[value] = associatedValue.value;
				break;
			case AssociatedValue.Classifier.Handling:
				userPrefs.handling[associatedValue.value] = Number(value);
		}
	}

	$: settingsForm = uiSettings.settingsForm.map(section => {
		return {
			...section,
			fields: section.fields.map(field => {
				return { ...field, value: mapFieldValue(userPrefs, field) }
			})
		}
	});
</script>

<main class="main">
	<Game 
		settings={SettingsPresets.Guideline} 
		uiSettings={uiSettings} 
		userPrefs={userPrefs}/>
	<Form 
		data={settingsForm}
		onChange={onFormDataChanged}/>
</main>

<style>
	.main {
		display: flex;
		justify-content: center;
		gap: 40px;
	}
</style>