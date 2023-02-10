<script>
	import Accordion, { Panel } from '@smui-extra/accordion';
	import FilterGroup from './components/filterGroup.svelte';
	import IconButton, { Icon } from '@smui/icon-button';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let freq = [];
	export let filteredFreq = [];
	export let filterBy = [];
	const clearSelections = () => {
		filterBy.forEach((prop) => {
			prop.selected = [];
		});
		filterBy = filterBy;
		dispatch('message', { text: 'Clear all filter selection.' });
	};
	console.log(freq, filteredFreq);
</script>

<div class="accordion-container">
	<div class="fliter-papers">
		<div class="mdc-typography--headline6">Fliters:</div>
		<IconButton class="material-icons" on:click={clearSelections} title="reset Selection"
			>replay</IconButton
		>
	</div>
	<Accordion multiple>
		{#each filterBy as prop}
			<Panel square extend>
				{#if prop.values.length > 0}
					<FilterGroup
						{...prop}
						freqGroup={freq[prop.name]}
						filterFreqGroup={filteredFreq[prop.name]}
						on:message
					/>
				{/if}
			</Panel>
			<!-- {(console.log({ prop }), '')} -->
		{/each}
	</Accordion>
</div>

<style>
	.fliter-papers {
		padding: 0px 0px 0px 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
