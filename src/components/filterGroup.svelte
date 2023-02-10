<script>
	import Chip, { Set, Text } from '@smui/chips';
	import { createEventDispatcher } from 'svelte';
	import Button, { Label } from '@smui/button';
	import { onMount } from 'svelte';
	import { Header, Content } from '@smui-extra/accordion';

	const dispatch = createEventDispatcher();

	export let name;
	export let selected;
	export let values;
	export let freqGroup;
	export let filterFreqGroup;

	let listVal = [];
	const sShowCount = 10;
	let showCount = 10;

	const updateShowCount = (newCount) => {
		const temp = values.sort((a, b) => {
			return freqGroup[a] <= freqGroup[b];
		});
		if (newCount > 0) {
			showCount = newCount;
		} else {
			showCount = sShowCount;
		}
		const data = values.slice(0, showCount);
		listVal = data.map((name) => {
			return '(' + freqGroup[name] + ') ' + name;
		});
	};
	const updateSelection = () => {
		dispatch('message', { text: selected });
	};

	onMount(async () => {
		listVal = values;
		updateShowCount(showCount);
	});
</script>

<Header>
	<div class="sizing">
		<div>
			{name}
			{#if selected !== undefined && selected.length}
				<span style="color:gray">
					({selected.length})
				</span>
			{/if}
		</div>
	</div>
</Header>

<Content>
	<Set chips={listVal} let:chip filter bind:selected on:click={updateSelection}>
		<Chip {chip} touch>
			<Text>{chip}</Text>
		</Chip>
	</Set>
	<div>
		{#if showCount > sShowCount}
			<Button on:click={() => updateShowCount(showCount - 10)}>
				<Label>see less</Label>
			</Button>
		{/if}
		{#if showCount <= values.length}
			<Button on:click={() => updateShowCount(showCount + 10)}>
				<Label>see more</Label>
			</Button>
		{/if}
	</div>
</Content>

<style>
	.sizing {
		/* font-size: 10px !important; */
		font-weight: bold !important;
		white-space: normal !important;
	}
</style>
