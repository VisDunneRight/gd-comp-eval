<script>
	import Slider from '@smui/slider';
	import Tooltip, { Wrapper } from '@smui/tooltip';
	import { createEventDispatcher } from 'svelte';
	import * as d3 from 'd3';

	const dispatch = createEventDispatcher();

	export let data;
	export let filteredData;
	let minYear;
	let maxYear;
	$: valueStart = minYear;
	$: valueEnd = maxYear;

	function onRangeUpdate() {
		dispatch('message', { start: valueStart, end: valueEnd });
	}

	[minYear, maxYear] = d3.extent(data, (d) => {
		if (d.year && +d.year) return Number(d.year);
	});

	const width = 240,
		height = 50;

	const convertData = (data, min, max) => {
		let res = {};
		for (var i = min; i <= max; i++) {
			res[i] = 0;
		}
		data.forEach((entry) => {
			if (+entry.year) res[+entry.year] += 1;
		});
		return Object.values(res);
	};
	let binData = convertData(data, minYear, maxYear);
	var x = d3.scaleLinear().domain([minYear, maxYear]).range([0, width]);
	var y = d3
		.scaleLinear()
		.domain([0, d3.max(binData)])
		.range([height, 0]);
	const bandWidth = (1.0 / binData.length) * width;
	$: color = (i) => {
		let year = i + minYear;
		if (year < valueStart || year > valueEnd) {
			return '#808080';
		} else {
			return '#69B3A2';
		}
	};
</script>

<div class="timeline-container">
	<div class="title"><strong>Time Filter:</strong></div>
	<div class="date-range">
		<div>{valueStart}</div>
		<div>{valueEnd}</div>
	</div>
	<Slider
		range
		bind:start={valueStart}
		bind:end={valueEnd}
		min={minYear}
		max={maxYear}
		step={1}
		input$aria-label="Timeline"
		on:MDCSlider:change={() => onRangeUpdate()}
	/>

	<div class="chart">
		<svg>
			<g>
				{#each binData as d, i}
					<Wrapper>
						<rect
							x={i * bandWidth}
							y={y(d)}
							width={bandWidth}
							height={height - y(d)}
							fill={color(i)}
						/>
						<Tooltip>Year:{minYear + i} Total:{d}</Tooltip>
					</Wrapper>
				{/each}
			</g>
		</svg>
	</div>
</div>

<style>
	.title {
		padding-top: 5px;
		padding-left: 5px;
	}
	.timeline-container {
		height: 150px;
	}
	.date-range {
		padding-left: 10px;
		padding-right: 10px;
		display: flex;
		justify-content: space-between;
	}
	.chart {
		padding-left: 20px;
	}
</style>
