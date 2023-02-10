import {
  graph_feature_categories,
  size_of_graphs_color,
  evaluation_type_categories,
  technique_categories,
} from "./categories";
import {
  get_graph_size,
  get_graph_features,
  get_year,
  blend_colors,
  get_evaluation_type,
  get_technique,
} from "./util";
import * as d3 from "d3";

export function draw_graph_sizes_by_graph_feature(data, div) {
  let options = {
    x_classification: undefined,
    y_classification: graph_feature_categories,
    y_function: get_graph_features,
    x_function: get_graph_size,
    x_filter_tags: ["none", "NA", "?", "", "custom", "Layered graphs"],
    y_filter_tags: [
      "none",
      "NA",
      "?",
      "",
      "Layered graphs",
      "Dynamic - continuous",
      "Book Embedding",
    ],
    y_threshold: 1,
    x_threshold: 3,
    color: "green",
    svg_height: 320,
  };

  draw_ranged_plot(data, div, options);
}

export function draw_graph_sizes_by_evaluation_type(data, div) {
  let options = {
    x_classification: undefined,
    y_classification: evaluation_type_categories,
    y_function: get_evaluation_type,
    x_function: get_graph_size,
    x_filter_tags: ["none", "NA", "?", "", "custom", "Layered graphs"],
    y_filter_tags: [
      "none",
      "NA",
      "?",
      "",
      "Layered graphs",
      "Dynamic - continuous",
      "Book Embedding",
    ],
    y_threshold: 1,
    x_threshold: 3,
    color: "green",
    svg_height: 340,
  };

  draw_ranged_plot(data, div, options);
}

export function draw_graph_sizes_by_technique(data, div) {
  let options = {
    x_classification: undefined,
    y_classification: technique_categories,
    y_function: get_technique,
    x_function: get_graph_size,
    x_filter_tags: ["none", "NA", "?", "", "custom", "Layered graphs"],
    y_filter_tags: [
      "none",
      "NA",
      "?",
      "",
      "Layered graphs",
      "Dynamic - continuous",
      "Book Embedding",
    ],
    y_threshold: 1,
    x_threshold: 3,
    color: "green",
    svg_height: 220,
  };

  draw_ranged_plot(data, div, options);
}

export function draw_ranged_plot(data, div, opts) {
  let ddict = {};

  let width = 600;
  let height = 1000;
  let padding = { top: 10, left: 130 };
  let line_vertical_distance = 2;

  let year_start = 1980;
  let year_end = 2022;

  let yearScale = d3.scaleLinear().domain([year_start, year_end]).range([0, 1]);

  let svg = div
    .append("svg")
    .attr("viewBox", [
      0,
      0,
      width,
      opts.svg_height != undefined ? opts.svg_height : height,
    ])
    .style("margin", "15px");

  for (let category in opts.y_classification) {
    ddict[category] = {};
    for (let subcategory of opts.y_classification[category]) {
      if (opts.y_filter_tags.includes(subcategory)) continue;
      ddict[category][subcategory] = [];
    }
  }

  // fill in ddict with ranges
  let x_max = 0;
  for (let entry of data) {
    if (opts.x_function(entry) == undefined) continue;
    if (isNaN(opts.x_function(entry)[0])) continue;
    if (opts.y_function(entry) == undefined || opts.y_function(entry) == "")
      continue;

    let found = false;
    for (let c in ddict) {
      if (found) break;
      for (let c2 in ddict[c]) {
        if (opts.y_function(entry).includes(c2)) {
          if (get_year(entry) < year_start || get_year(entry) > year_end)
            continue;
          ddict[c][c2].push([opts.x_function(entry), get_year(entry)]);
          found = true;

          if (opts.x_function(entry)[1] > x_max)
            x_max = opts.x_function(entry)[1];
        }
      }
    }

    if (!found) console.error("missing category: " + opts.y_function(entry));
  }

  let xScale = d3
    .scaleLog()
    .domain([1, x_max])
    .range([padding.left + 5, width - padding.left]);

  let y_index = 0;
  for (let c in ddict) {
    for (let c2 in ddict[c]) {
      let y_start = y_index;
      if (ddict[c][c2].length < opts.x_threshold) continue;
      ddict[c][c2] = ddict[c][c2].sort((a, b) => (a[0][1] > b[0][1] ? -1 : 1));

      // console.log(ddict[c][c2])

      for (let range of ddict[c][c2]) {
        let r = range[0];
        // console.log(range[1], yearScale(range[1]), blend_colors(size_of_graphs_color, graph_feature_color, yearScale(range[1])))
        // console.log(r)
        svg
          .append("rect")
          .attr("x", xScale(r[0]))
          .attr("y", y_index * line_vertical_distance + padding.top)
          .attr("width", xScale(r[1]) - xScale(r[0]) + 2)
          .attr("height", 1)
          .style("fill", "red")
          .attr(
            "stroke",
            blend_colors(size_of_graphs_color, "#fff", 1 - yearScale(range[1]))
          )
          .attr("stroke-width", 1);
        // .style("opacity", 0.5)

        y_index += 1;
      }

      let y_end = y_index;

      svg
        .append("text")
        .attr("x", padding.left)
        .attr(
          "y",
          (y_start + (y_end - y_start) / 2) * line_vertical_distance +
            padding.top +
            3
        )
        .text(c2)
        .style("font-size", "0.65em")
        .style("text-anchor", "end");

      svg
        .append("line")
        .attr("x1", padding.left + 5)
        .attr("y1", y_start * line_vertical_distance + padding.top)
        .attr("x2", padding.left + 5)
        .attr("y2", y_end * line_vertical_distance + padding.top)
        .style("stroke", "#ddd")
        .style("stroke-width", 2);

      svg
        .append("line")
        .attr("x1", 0)
        .attr(
          "y1",
          y_end * line_vertical_distance + padding.top + line_vertical_distance
        )
        .attr("x2", width - padding.left)
        .attr(
          "y2",
          y_end * line_vertical_distance + padding.top + line_vertical_distance
        )
        .style("stroke", "#eee");

      y_index += 2;
    }
  }

  // add lines in background
  for (let i = 10; i < x_max; i *= 10) {
    // console.log(i)

    svg
      .append("text")
      .attr("x", xScale(i))
      .attr("y", y_index * line_vertical_distance + padding.top + 10)
      .text(i)
      .style("font-size", "0.6em")
      .style("text-anchor", "middle");

    svg
      .append("line")
      .attr("x1", xScale(i))
      .attr("y1", padding.top)
      .attr("x2", xScale(i))
      .attr("y2", y_index * line_vertical_distance + padding.top - 5)
      .style("stroke", "#ddd")
      .style("stroke-dasharray", "2,2");
  }
}
