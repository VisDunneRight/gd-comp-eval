<script>
  import * as cor from '../js/correlations';
  import * as gs from "../js/graph_sizes";
  import * as time from "../js/timelines";
  import {get_title} from '../js/util'
  import { onMount } from 'svelte';
  import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
  import Chip, { Set, Text } from '@smui/chips';
  import database from "../data/database(14).json";
  import * as d3 from 'd3';
  let data = database["results"]

  for (let i in data){ // cleanup of data table
      if (get_title(data[i]).includes("EXCLUDE")) {
          data.splice(i, 1)
      }
  }
  let choicesCorr = ['Graph Feature x Results', 'Graph Feature x Data', 'Graph Feature x Graph Feature', 'Results x Results', "Evaluation Type x Results", "Evaluation Type x Evaluation Type", "Graph Feature x Evaluation Type"];
  let selectedCorr = 'Graph Feature x Results';
  let chartGFR;
  let chartGFD;
  let chartGFGF;
  let chartRR;
  let chartETR;
  let chartETET;
  let chartGFET;

  let choicesBar = ["Supplemental Material","Code Availability", "Results measured", "Evaluation Types", "Dataset Used"];
  let selectedBar = "Supplemental Material";
  let divBar = {"Supplemental Material": Object,"Code Availability": Object, "Results measured": Object, "Evaluation Types": Object, "Dataset Used": Object}

  let choicesGS = ["Graph Feature", "Evaulation Type", "Techniques"];
  let selectedGS = "Graph Feature";
  let divGS = {"Graph Feature": Object,"Evaulation Type": Object,"Techniques": Object}

  onMount(async() =>{
    let div1 = d3.select(chartGFR);
    cor.draw_correlation_of_graph_feature_and_results_reported(data, div1);
    let div2 = d3.select(chartGFD);
    cor.draw_correlation_of_graph_feature_and_dataset_used(data, div2);
    let div3 = d3.select(chartGFGF);
    cor.draw_correlation_of_graph_feature_and_graph_feature(data, div3);
    let div4 = d3.select(chartRR);
    cor.draw_correlation_of_result_reported_and_result_reported(data, div4);
    let div5 = d3.select(chartETR);
    cor.draw_correlation_of_evaluation_type_and_result_reported(data, div5);
    let div6 = d3.select(chartETET);
    cor.draw_correlation_of_evaluation_type_and_evaluation_type(data, div6);
    let div7 = d3.select(chartGFET);
    cor.draw_correlation_of_graph_feature_and_evaluation_type(data, div7);

    let div8 = d3.select(divBar["Supplemental Material"])
    time.draw_suppl_material_by_year(data, div8);
    let div9 = d3.select(divBar["Code Availability"])
    time.draw_provides_code_over_the_years(data, div9);
    let div10 = d3.select(divBar["Results measured"])
    time.draw_results_measured_over_the_years(data, div10);
    let div11 = d3.select(divBar["Evaluation Types"])
    time.draw_evaluation_type_over_the_years(data, div11);
    let div12 = d3.select(divBar["Dataset Used"])
    time. draw_datasets_used_over_the_years(data, div12);


    let div13 = d3.select(divGS["Graph Feature"])
    gs.draw_graph_sizes_by_graph_feature(data, div13);
    let div14 = d3.select(divGS["Evaulation Type"])
    gs.draw_graph_sizes_by_evaluation_type(data, div14);
    let div15 = d3.select(divGS["Techniques"])
    gs.draw_graph_sizes_by_technique(data, div15);

  });
</script>
<div class="accordion-container vis-panel">
  <Accordion multiple>
    <Panel>
      <Header>Correlation Matrix</Header>
      <Content>
        <Set chips={choicesCorr} let:chip choice bind:selected={selectedCorr}>
          <Chip {chip}>
            <Text>{chip}</Text>
          </Chip>
        </Set>
          <div style={selectedCorr === "Graph Feature x Results"? "display:inital": "display:none"} bind:this={chartGFR}/>
          <div style={selectedCorr === "Graph Feature x Data"? "display:inital": "display:none"} bind:this={chartGFD}/>
          <div style={selectedCorr === "Graph Feature x Graph Feature"? "display:inital": "display:none"} bind:this={chartGFGF}/>
          <div style={selectedCorr === "Results x Results"? "display:inital": "display:none"} bind:this={chartRR}/>
          <div style={selectedCorr === "Evaluation Type x Results"? "display:inital": "display:none"} bind:this={chartETR}/>
          <div style={selectedCorr === "Evaluation Type x Evaluation Type"? "display:inital": "display:none"} bind:this={chartETET}/>
          <div style={selectedCorr === "Graph Feature x Evaluation Type"? "display:inital": "display:none"} bind:this={chartGFET}/>
      </Content>
    </Panel>
    <Panel>
      <Header>Stacked Bar Charts</Header>
      <Content>
        <Set chips={choicesBar} let:chip choice bind:selected={selectedBar}>
          <Chip {chip}>
            <Text>{chip}</Text>
          </Chip>
        </Set>
        {#each choicesBar as cbar}
          <div style={selectedBar === cbar? "display:inital": "display:none"} bind:this={divBar[cbar]}/>
        {/each}
      </Content>
    </Panel>
    <Panel>
      <Header>Graph Sizes</Header>
      <Content>
        <Set chips={choicesGS} let:chip choice bind:selected={selectedGS}>
          <Chip {chip}>
            <Text>{chip}</Text>
          </Chip>
        </Set>
          {#each choicesGS as cgs}
          <div style={selectedGS === cgs? "display:inital": "display:none"} bind:this={divGS[cgs]}/>
        {/each}
        
      </Content>
    </Panel>
  </Accordion>
</div>

<style>
  .vis-panel{
    padding:10px 5px;
  }
</style>