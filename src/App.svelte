<script>
  import {Pane, Splitpanes} from 'svelte-splitpanes';
	import IconButton from '@smui/icon-button';
	import PaperCard from './components/paperCard.svelte';
	import structure from './data/Layout-Survey.json';
	import FilterPanel from './filterPanel.svelte';
	import SearchField from './components/searchField.svelte';
	import Timeline from './components/timeline.svelte';
  import Header from "./header.svelte";
  import Vis from "./vis.svelte";

	import { onMount } from 'svelte';

	let innerHeight = 0;
	let innerWidth = 0;

	let showImg = false;
	let showVis = true;
	let filteredData = [];
	let meta = {};
	let freq = {};
	let filteredFreq = {};
	let filter = {
		searchWord: '',
		yearRange: [-1, -1]
	};

	//Restructuring parts of the data passed in
	structure.meta.forEach((prop) => {
		meta[prop.name] = prop;
	});

	let filterBy = structure.filterBy;
	filterBy.forEach((prop) => {
		if (prop.name in meta && meta[prop.name].type === 'MultiSelect') prop.selected = [];
	});

	function freqCount(prop, arrValue, freqDict) {
		if (prop in meta && meta[prop].type === 'MultiSelect') {
			if (arrValue.length == 1 && arrValue[0] === '') {
				return;
			}
			arrValue.forEach((value) => {
				if (prop in freq) {
					freqDict[prop][value] ? freqDict[prop][value]++ : (freqDict[prop][value] = 1);
				} else {
					freqDict[prop] = {};
					freqDict[prop][value] = 1;
				}
			});
		}
	}

	structure.data.forEach((paper) => {
		Object.entries(paper).forEach(([prop, arrValue]) => {
			freqCount(prop, arrValue, freq);
		});
		paper['selected'] = false;
	});
	onMount(async () => {
		applyFilters();
	});

	function applyFilters() {
		//This is a shallow copy, we only interested in the order
		let startingPoint = [...structure.data];

		//Filter by search bar
		if (filter.searchWord !== '') {
			startingPoint = startingPoint.filter((paper) =>
				paper.Name.toLowerCase().includes(filter.searchWord.toLowerCase())
			);
		}
		if (filter.yearRange[0] > 0)
			startingPoint = startingPoint.filter(
				(paper) => filter.yearRange[0] < +paper.year && +paper.year < filter.yearRange[1]
			);

		//Filter by categories
		filterBy.forEach((group) => {
			if (group.selected && group.selected.length > 0) {
				const selected = group.selected.map((sel) => {
					return sel.split(') ')[1];
				});
				let res = [];
				startingPoint.forEach((paper) => {
					let found = false;
					if (Array.isArray(paper[group.name])) {
						const listCate = paper[group.name];
						found = true;
						selected.forEach((prop) => {
							if (listCate.includes(prop) === false) {
								found = false;
								return;
							}
						});
					} else if (typeof paper[group.name] === 'string') {
						found = selected.includes(paper[group.name]);
					}

					if (found) {
						res.push(paper);
					}
				});
				startingPoint = res;
			}
		});
		Object.entries(startingPoint).forEach(([prop, arrValue]) => {
			freqCount(prop, arrValue, filteredFreq);
		});
		filteredData = startingPoint.sort((p1, p2) => {
			if(Number(p1.year) < Number(p2.year)){
				return 1;
			} else {
				return -1;
			}
		});
	}

	function setVis() {
		showVis = !showVis;
	}

	function updateSearchResults(search) {
		filter.searchWord = search.detail.text;
		applyFilters();
	}
	function updateTimeRange(ranges) {
		filter.yearRange[0] = ranges.detail.start;
		filter.yearRange[1] = ranges.detail.end;
		applyFilters();
	}

	console.log(innerWidth, innerHeight);
</script>

<svelte:window bind:innerHeight bind:innerWidth />
<Header detailView={structure.detailView} {freq} />
<body>
	<div class="left-panel">
		<div class="num-papers">
			<div class="mdc-typography--headline6">Number of papers:</div>
			<div class="mdc-typography--headline6">{filteredData.length}/{structure.data.length}</div>
		</div>
		<SearchField on:message={updateSearchResults} />
		<Timeline {filteredData} data={structure.data} on:message={updateTimeRange} />
		<FilterPanel {filterBy} {freq} {filteredFreq} on:message={applyFilters} />
	</div>
	<div class="main-view">
		<Splitpanes class="default-theme" style="height:{innerHeight - 80}">
			<Pane>
				<div class="card-container">
					{#each filteredData as paper}
						<PaperCard
							{paper}
							summaryView={structure.summaryView}
							detailView={structure.detailView}
							{meta}
							{showImg}
						/>
					{/each}
				</div>
				{#if !showVis}
					<div class="hide-button">
						<IconButton class="material-icons" on:click={setVis}
							>keyboard_double_arrow_left</IconButton
						>
					</div>
				{/if}
			</Pane>
			{#if showVis}
				<Pane>
					<div class="show-button">
						<IconButton class="material-icons" on:click={setVis}>
							keyboard_double_arrow_right
						</IconButton>
					</div>
					<Vis/>
				</Pane>
			{/if}
		</Splitpanes>
	</div>
</body>

<style>
	body {
		font-family: sans-serif;
		margin-top: 80px;
	}
	.container {
		display: flex; /* or inline-flex */
		align-items: center;
	}
	.left-panel {
		position: fixed;
		width: 300px;
		height: 100%;
		overflow-x: hidden;
	}
	.main-view {
		padding-left: 300px;
	}
	.card-container {
		/* display: grid;
		column-gap: 10px; */
	}
	.show-button {
		position: fixed;
		top: 80px;
		z-index: 2;
	}
	.hide-button {
		position: fixed;
		right: 0px;
		top: 80px;
	}
	.num-papers {
		padding: 15px 15px;
		display: flex;
		justify-content: space-between;
	}
	.demo-cell {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 10px;
		border: 1px;
		border-style: solid;
		border-color: var(--mdc-theme-secondary, #333);
		color: var(--mdc-theme-secondary, rgb(15, 9, 9));
	}
</style>
