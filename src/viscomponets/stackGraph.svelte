<script>
  import { blend_colors, spectralColorScheme } from "./util";
  import * as d3 from "d3";
  import Autocomplete from '@smui-extra/autocomplete';
  import Chip, { Set, TrailingAction, Text } from '@smui/chips';
  import Checkbox from '@smui/checkbox';
  import FormField from '@smui/form-field';

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  const config = { height: 200, width: 600, size: 10, gap: 4 };
  const padding = { top: 30, right: 40, bottom: 10, left: 50 };

  export let data;
  export let filterBy;
  export let selectedCate;
  $:startRange = 2000;
  $:endRange = 2022;
  $:stepSize = 2;
  let otherCheck = true;

  let w = 100,
    h = 100;
  function getDimInfo(selectedDim, filterBy) {
    let selectProp = undefined;
    let ind = -1;
    filterBy.forEach((prop, i) => {
      if ("groupName" in prop) {
        if (prop["groupName"] === selectedDim) {
          selectProp = prop;
          ind = i;
          return;
        }
      } else {
        if (prop["name"] === selectedDim) {
          selectProp = prop;
          ind = i;
          return;
        }
      }
    });

    //In the case the
    filterBy.forEach((prop, i) => {
      if ("groupName" in prop) {
        prop.categories.forEach((cate) => {
          if (cate["name"] === selectedDim) {
            selectProp = cate;
            ind = i;
            return;
          }
        });
      }
    });

    return selectProp;
  }

  function genData(data, cate, selectedTags, startRange, endRange, step, otherCheck) {
    let dataset = {};
    data.forEach((ele) => {
      const numYear = parseInt(ele.Year);
      if(numYear >= startRange){
        const year = Math.floor((numYear - startRange)/step)*step + startRange;
        if (!(year in dataset)) {
          dataset[year] = {};
        }
        ele[cate.name].forEach((tag) => {
          dataset[year][tag] = (dataset[year][tag] || 0) + 1;
        });
      }
    });
    
    let catePaths = {};
    let selectedCate = {};
    selectedTags.forEach(ele => {
      selectedCate[ele] = { path: [], total: 0, name: ele, pathSum: [] };
    });
    //Find the max path
    cate.values.forEach((tag) => {
      catePaths[tag] = { path: [], total: 0, name: tag, pathSum: [] };
      for (let i = startRange; i <= endRange; i += step) {
        const x = (i - startRange)/step * config.size;
        if (i in dataset && tag in dataset[i]) {
          const count = dataset[i][tag];
          catePaths[tag].path.push({
            x: x,
            y: count,
          });
          catePaths[tag].total += count;
        } else {
          catePaths[tag].path.push({ x: x, y: 0 });
        }
      }
    });
    
    Object.values(catePaths).forEach((val) => {
      if (selectedTags.includes(val.name)) {
        selectedCate[val.name] = val;
      } else if(otherCheck){
        selectedCate["Other"].total += val.total;
        val.path.forEach((point, idx) => {
          if (idx >= selectedCate["Other"].path.length) {
            selectedCate["Other"].path.push({ x: point.x, y: point.y });
          } else {
            selectedCate["Other"].path[idx].y += point.y;
          }
        });
      }
    });

    //Back of the visualization
    let arrayCate = Object.values(selectedCate);

    //Generate the frequence of the each tag
    let totalCount = [];
    const numElements = arrayCate[0]?.path.length;
    for (let i = 0; i < numElements; i += 1) {
      let count = 0;
      arrayCate.forEach((cate) => {
        count += cate.path[i].y;
        cate.pathSum.push({ x: cate.path[i].x, y: count });
      });
      totalCount.push(count);
    }
    arrayCate.forEach((cate) => {
      for (let i = 0; i < numElements; i += 1) {
        cate.pathSum[i].y = cate.pathSum[i].y / totalCount[i] || 0;
      }
    });

    //flip for rendering and return array
    return arrayCate.reverse();
  }

  $: cate = getDimInfo(selectedCate, filterBy);
  //comboBox for selecting tags
  let selected = ['Other'];
  $:tags = [...cate.values];
  $:availableTags = tags.filter((value) => !selected.includes(value));
  let selector;
  let tagValue = '';
  function handleSelection(event) {
    // Don't actually select the item.
    event.preventDefault();
    // You could also set value back to '' here.
    selected.unshift(event.detail);
    // Make sure the chips get updated.
    selected = selected;
    // selector.focus();
  }

  $:if(otherCheck){
    if(selected.includes('Other') === false){
      selected.push('Other');
    }
  } else {
    selected = selected.filter((tag) => {return tag !== 'Other'});
  }
  $: dataset = genData(
    data,
    cate,
    selected,
    startRange,
    endRange,
    stepSize,
    otherCheck
  );

  $:range = (endRange - startRange + 1)
  // $: console.log(dataset);
  $: y = d3
    .scaleLinear()
    .domain([0, 1])
    .range([config.height
     - padding.bottom, padding.top]);
  $: x = d3
    .scaleLinear()
    .domain([0, (range/stepSize) * config.size])
    .range([padding.left, config.width - padding.right]);

  $: if (dataset) {
    dataset.forEach((tag) => {
      tag.pathLine = `M${x(tag.pathSum[0].x)},${y(tag.pathSum[0].y)}`;
      for (let i = 0; i < tag.pathSum.length - 1; i++) {
        const cp = tag.pathSum[i];
        const np = tag.pathSum[i + 1];
        // tag.pathLine +=`L${x(cp.x)},${y(cp.y)} L${x(cp.x + config.size)},${y(cp.y/csp || 0)}`;
        tag.pathLine +=
          ` L${x(cp.x + config.size - config.gap)},${y(cp.y)}` +
          ` Q${x(cp.x + config.size)},${y(cp.y)}` +
          ` ${x(np.x)},${y((np.y + cp.y) / 2 || 0)}` +
          ` T${x(np.x + config.gap)},${y(np.y || 0)}`;
      }
      tag.pathLine += `L${x(
        tag.pathSum[tag.pathSum.length - 1].x + config.size
      )},${y(tag.pathSum[tag.pathSum.length - 1].y)}`;
    });
  }
  //yticks and xTicks
  let yTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  $: xTicks = [];
  $:for(let i = startRange; i <= endRange; i += stepSize){
    xTicks.push(i);
  }


</script>

<div class="stack-container" bind:clientWidth={w} bind:clientHeight={h}>
  <Autocomplete
    bind:this={selector}
    options={availableTags}
    bind:value={tagValue}
    label="Tags"
    on:SMUIAutocomplete:selected={handleSelection}
  />
  <FormField>
    <Checkbox bind:checked={otherCheck} touch />
    <span slot="label">Group Rest as Other</span>
  </FormField>

  
  <div class="status">
    <pre style="display: inline-block;">Tags:</pre>
    <Set style="display: inline-block;" bind:chips={selected} let:chip>
      <Chip {chip} style="background-color:{spectralColorScheme[dataset.findIndex((ele)=> ele.name === chip)]}">
        <Text tabindex={0}>{chip}</Text>
        {#if chip !== "Other"}
          <TrailingAction icon$class="material-icons">cancel</TrailingAction>  
        {/if}
      </Chip>
    </Set>
  </div>

  <svg class="svg-container" viewBox="0 0 600 300">
    <g class="y-axis">
      <text
        x={x(0) + 50}
        y="12"
        text-anchor="end"
        font-weight="bold"
        alignment-baseline="middle">Frequency</text
      >
      {#each yTicks as tick}
        <g
          class="tick tick-{tick}"
          transform="translate({x(0) - 10}, {y(tick)})"
        >
          <text x="-3" alignment-baseline="middle" text-anchor="end">{tick*100}%</text>
          <line x1="-3" x2="5" stroke="black" stroke-width="2"/>
        </g>
      {/each}
    </g>
    <g class="x-axis">
      {#each xTicks as tick, i}
      <text
            text-anchor="start"
            transform="translate({x(i*config.size + config.size/2)}, {y(0) + 10}) rotate(45)"
            alignment-baseline="middle"
            class="model-text">{tick}</text>   
      {/each}
    </g>
    <g>
      {#each dataset as tags, ind}
        <path
          class="path-area"
          fill={spectralColorScheme[ind]}
          stroke={blend_colors(spectralColorScheme[ind],"#000000", .2)}
          d={tags.pathLine +
            `L${x((Math.floor(range/stepSize) + 1) * config.size)},${y(0)}L${x(0)},${y(0)}Z`}
        />
        <!-- <path style="z-index:{totalNumTags - ind}" stroke={defaultColors[ind]} class="path-line" d={tags.pathLine} /> -->
      {/each}
    </g>
  </svg>
</div>

<style>
  .path-line {
    fill: none;
    /* stroke: rgb(0, 100, 100); */
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3;
  }

  .model-text{
    font-weight: bold;
  }
  .path-area {
    
  }
  .stack-container {
    width: 100%;
    height: 100%;
    padding-top: 20px;
  }
</style>
