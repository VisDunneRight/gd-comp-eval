// multiselects:
// paper type,
// graph feature,
// dataset tag clean,
// results measured,
// type of edit to the dataset,
// evaluation type,
// evaluation qual/quant,
// supplemental material,
// type of storage
import {
  blend_colors,
  get_results_reported,
  get_graph_features,
  get_dataset_used,
  get_evaluation_type,
} from "./util";

import {
  results_categories,
  graph_feature_categories,
  graph_feature_color,
  metrics_color,
  dataset_categories,
  dataset_color,
  evaluation_type_categories,
  evaluation_type_color,
} from "./categories";

export function draw_correlation_of_graph_feature_and_results_reported(
  data,
  div
) {
  let options = {
    y_classification: results_categories,
    x_classification: graph_feature_categories,
    x_function: get_results_reported,
    y_function: get_graph_features,
    x_filter_tags: ["none", "NA", "?", "", "None"],
    y_filter_tags: ["none", "NA", "?", "", "Layered graphs", "None", "Dynamic"],
    y_threshold: 3,
    x_threshold: 3,
    color: blend_colors(graph_feature_color, metrics_color, 0.6),
  };

  draw_correlations_normalized_by_row(data, div, options);
}

export function draw_correlation_of_graph_feature_and_dataset_used(data, div) {
  let options = {
    y_classification: dataset_categories,
    x_classification: graph_feature_categories,
    y_function: get_graph_features,
    x_function: get_dataset_used,
    x_filter_tags: [
      "none",
      "NA",
      "?",
      "",
      "custom",
      "Layered graphs",
      "North DAG*",
      "Rome-Lib*",
      "AT&T*",
      "Padia stories",
    ],
    y_filter_tags: ["none", "NA", "?", "", "Layered graphs", "Dynamic"],
    y_threshold: 3,
    x_threshold: 3,
    color: blend_colors(graph_feature_color, dataset_color, 0.5),
  };

  draw_correlations_normalized_by_row(data, div, options);
}

export function draw_correlation_of_graph_feature_and_graph_feature(data, div) {
  let options = {
    y_classification: graph_feature_categories,
    x_classification: graph_feature_categories,
    y_function: get_graph_features,
    x_function: get_graph_features,
    x_filter_tags: [
      "none",
      "NA",
      "?",
      "",
      "custom",
      "Layered graphs",
      "Dynamic",
    ],
    y_filter_tags: ["none", "NA", "?", "", "Layered graphs", "Dynamic"],
    y_threshold: 2,
    x_threshold: 2,
    color: graph_feature_color,
  };

  draw_correlations_normalized_by_row(data, div, options);
}

export function draw_correlation_of_result_reported_and_result_reported(
  data,
  div
) {
  let options = {
    y_classification: results_categories,
    x_classification: results_categories,
    y_function: get_results_reported,
    x_function: get_results_reported,
    x_filter_tags: ["none", "NA", "?", "", "custom", "None"],
    y_filter_tags: ["none", "NA", "?", "", "None", "custom"],
    y_threshold: 5,
    x_threshold: 4,
    color: metrics_color,
  };

  draw_correlations_normalized_by_row(data, div, options);
}

export function draw_correlation_of_evaluation_type_and_result_reported(
  data,
  div
) {
  let options = {
    y_classification: results_categories,
    x_classification: evaluation_type_categories,
    y_function: get_evaluation_type,
    x_function: get_results_reported,
    x_filter_tags: ["none", "NA", "?", "", "custom", "None"],
    y_filter_tags: ["none", "NA", "?", "", "None", "custom"],
    y_threshold: 5,
    x_threshold: 3,
    color: blend_colors(evaluation_type_color, metrics_color, 0.5),
  };

  draw_correlations_normalized_by_row(data, div, options);
}

export function draw_correlation_of_evaluation_type_and_evaluation_type(
  data,
  div
) {
  let options = {
    y_classification: evaluation_type_categories,
    x_classification: evaluation_type_categories,
    y_function: get_evaluation_type,
    x_function: get_evaluation_type,
    x_filter_tags: ["none", "NA", "?", "", "custom", "None"],
    y_filter_tags: ["none", "NA", "?", "", "None", "custom"],
    y_threshold: 2,
    x_threshold: 2,
    color: evaluation_type_color,
  };

  draw_correlations_normalized_by_row(data, div, options);
}

export function draw_correlation_of_graph_feature_and_evaluation_type(
  data,
  div
) {
  let options = {
    x_classification: graph_feature_categories,
    y_classification: evaluation_type_categories,
    y_function: get_graph_features,
    x_function: get_evaluation_type,
    x_filter_tags: [
      "none",
      "NA",
      "?",
      "",
      "custom",
      "None",
      "User Study x2",
      "Informal User Study",
    ],
    y_filter_tags: [
      "none",
      "NA",
      "?",
      "",
      "None",
      "custom",
      "User Study x2",
      "Dynamic",
      "Layered graphs",
    ],
    y_threshold: 2,
    x_threshold: 2,
    color: blend_colors(graph_feature_color, evaluation_type_color, 0.7),
  };

  draw_correlations_normalized_by_row(data, div, options);
}

export function draw_correlations_normalized_by_row(data, div, opts) {
  let width = 1000;
  let height = 1000;
  let space_between = 5;
  let h_space_between_classifications = 20;
  let square_width = 15;
  let square_height = 15;
  let padding = { left: 180, right: 100, top: 160, bottom: 30 };
  opts.color = opts.color ? opts.color : "steelblue";

  let svg = div
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .style("margin", "15px");

  let graph_feature_dict = {};
  let graph_feature_dict_total_counts = {};
  let classification = opts.y_classification;
  let classification_v = opts.x_classification;

  let all_y_tags = new Set(
    data
      .map((d) =>
        opts.y_function(d).filter((x) => !opts.y_filter_tags.includes(x))
      )
      .flat()
  );
  let all_x_tags = new Set(
    data
      .map((d) =>
        opts.x_function(d).filter((x) => !opts.x_filter_tags.includes(x))
      )
      .flat()
  );

  let y_tags_in_classification = new Set(
    Object.values(classification_v).flat()
  );
  let x_tags_in_classification = new Set(Object.values(classification).flat());

  classification_v["Other"] = classification_v["Other"].concat(
    [...all_y_tags].filter((x) => !y_tags_in_classification.has(x))
  );
  classification["Other"] = classification["Other"].concat(
    [...all_x_tags].filter((x) => !x_tags_in_classification.has(x))
  );

  for (let entry of data) {
    let graph_features = opts
      .y_function(entry)
      .filter((x) => !opts.y_filter_tags.includes(x));
    let results_reported = opts
      .x_function(entry)
      .filter((a) => !opts.x_filter_tags.includes(a));

    for (let graph_feature of graph_features) {
      if (!(graph_feature in graph_feature_dict)) {
        graph_feature_dict[graph_feature] = {};
        graph_feature_dict_total_counts[graph_feature] = {};
      }

      for (let result_reported of results_reported) {
        if (!(result_reported in graph_feature_dict[graph_feature])) {
          if (graph_feature == result_reported) continue;
          graph_feature_dict[graph_feature][result_reported] = 0;
          graph_feature_dict_total_counts[graph_feature][result_reported] = 0;
        }

        graph_feature_dict[graph_feature][result_reported] += 1;
        graph_feature_dict_total_counts[graph_feature][result_reported] += 1;
      }
    }
  }

  for (let graph_feature in graph_feature_dict) {
    let total = 0;
    for (let result_reported in graph_feature_dict[graph_feature]) {
      total += graph_feature_dict[graph_feature][result_reported];
    }

    if (total <= opts.y_threshold) {
      delete graph_feature_dict[graph_feature];
    } else {
      for (let result_reported in graph_feature_dict[graph_feature]) {
        graph_feature_dict[graph_feature][result_reported] /= total;
      }
    }
  }

  let dict_of_results_reported = {};
  for (let graph_feature in graph_feature_dict) {
    for (let result_reported in graph_feature_dict[graph_feature]) {
      if (!(result_reported in dict_of_results_reported)) {
        dict_of_results_reported[result_reported] = 0;
      }
      dict_of_results_reported[result_reported] += 1;
    }
  }

  // sort classifications
  for (let c in classification) {
    classification[c] = classification[c].sort((a, b) => {
      let a_val = Object.values(graph_feature_dict_total_counts)
        .map((k) => Object.keys(k))
        .flat()
        .filter((k) => k == a).length;
      let b_val = Object.values(graph_feature_dict_total_counts)
        .map((k) => Object.keys(k))
        .flat()
        .filter((k) => k == b).length;
      return b_val - a_val;
    });
  }

  if (opts.x_function != opts.y_function)
    for (let c in classification_v) {
      classification_v[c] = classification_v[c].sort((a, b) => {
        let a_val =
          graph_feature_dict_total_counts[a] != undefined
            ? Object.values(graph_feature_dict_total_counts[a]).reduce(
                (a, b) => a + b,
                0
              )
            : -1;
        let b_val =
          graph_feature_dict_total_counts[b] != undefined
            ? Object.values(graph_feature_dict_total_counts[b]).reduce(
                (a, b) => a + b,
                0
              )
            : -1;
        return b_val - a_val;
      });
    }
  else {
    // console.log(opts.x_function, opts.y_function)
    // console.log(classification, classification_v)
    // for (let c in classification_v){
    //     classification_v[c] = classification_v[c].sort((a, b) => {
    //         let a_val = classification[c].indexOf(a)
    //         let b_val = classification[c].indexOf(b)
    //         return b_val - a_val;
    //     })
    // }
  }

  // console.log(dict_of_results_reported)
  let list_of_results_reported = Object.keys(dict_of_results_reported).filter(
    (a) => dict_of_results_reported[a] >= opts.x_threshold
  );
  // console.log(list_of_results_reported)

  let v_coords = {};
  let v_index = padding.top + 12;
  for (let c in classification_v) {
    let val_found = false;
    let coord_start = v_index;
    for (let f of classification_v[c]) {
      if (graph_feature_dict[f] == undefined) continue;
      v_coords[f] = v_index;
      val_found = true;
      v_index += square_height + space_between;
    }
    if (val_found && c != "Other") {
      v_index += h_space_between_classifications;
    }
  }

  let h_coords = {};
  let h_index = padding.left + 12;

  let color1 = () => {
    if (opts.y_function == get_graph_features) return graph_feature_color;
    if (opts.y_function == get_results_reported) return metrics_color;
    if (opts.y_function == get_evaluation_type) return evaluation_type_color;
    if (opts.y_function == get_dataset_used) return dataset_color;
    else return "black";
  };

  let color2 = () => {
    if (opts.x_function == get_evaluation_type) return evaluation_type_color;
    if (opts.x_function == get_graph_features) return graph_feature_color;
    if (opts.x_function == get_results_reported) return metrics_color;
    if (opts.x_function == get_dataset_used) return dataset_color;
    else return "black";
  };

  for (let c in classification) {
    let val_found = false;
    let coord_start = h_index;
    for (let f of classification[c]) {
      if (!list_of_results_reported.includes(f)) continue;
      h_coords[f] = h_index;
      val_found = true;
      h_index += square_height + space_between;
    }
    if (val_found && c != "Other") {
      h_index += h_space_between_classifications;
    }
  }

  h_index += 10;
  for (let c in classification_v) {
    let mincoord = Math.min.apply(
      0,
      classification_v[c].map((a) => {
        return v_coords[a] != undefined ? v_coords[a] : Infinity;
      })
    );
    let maxcoord =
      Math.max.apply(
        0,
        classification_v[c].map((a) => {
          return v_coords[a] != undefined ? v_coords[a] : -Infinity;
        })
      ) + square_height;

    svg
      .append("line")
      .attr("x1", padding.left)
      .attr("y1", mincoord)
      .attr("x2", padding.left)
      .attr("y2", maxcoord)
      .attr("stroke", color1)
      .attr("stroke-width", "4");

    svg
      .append("text")
      .attr("x", h_index + 30)
      .attr("y", (mincoord + maxcoord) / 2)
      .attr("text-anchor", "start")
      .style("font-size", "0.6em")
      .style("fill", "gray")
      .text(c);

    svg
      .append("line")
      .attr("x1", h_index + 20)
      .attr("y1", mincoord - 10)
      .attr("x2", h_index + 20)
      .attr("y2", maxcoord + 5)
      .attr("stroke", "#ccc")
      .attr("stroke-width", "3");

    svg
      .append("line")
      .attr("x1", h_index + 20)
      .attr("y1", mincoord - 10)
      .attr("x2", h_index + 10)
      .attr("y2", mincoord - 10)
      .attr("stroke", "#ccc")
      .attr("stroke-width", "3");

    svg
      .append("line")
      .attr("x1", h_index + 20)
      .attr("y1", maxcoord + 5)
      .attr("x2", h_index + 10)
      .attr("y2", maxcoord + 5)
      .attr("stroke", "#ccc")
      .attr("stroke-width", "3");

    if (c != "Other")
      svg
        .append("line")
        .attr("x1", padding.left)
        .attr("y1", maxcoord + h_space_between_classifications / 2)
        .attr("x2", h_index - 10)
        .attr("y2", maxcoord + h_space_between_classifications / 2)
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", "3");

    svg
      .append("line")
      .attr("x1", h_index - 10)
      .attr("y1", mincoord - 10)
      .attr("x2", h_index - 10)
      .attr("y2", maxcoord + 5)
      .attr("stroke", "#eee")
      .attr("stroke-width", "2");

    for (let f of classification_v[c]) {
      if (v_coords[f] == undefined) continue;

      let tmp = Object.keys(graph_feature_dict_total_counts[f])
        .filter((k) => list_of_results_reported.includes(k))
        .map((k) => graph_feature_dict_total_counts[f][k])
        .reduce((a, b) => a + b, 0);

      svg
        .append("text")
        .attr("x", h_index + 5)
        .attr("y", v_coords[f] + square_height / 2 + 4)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "gray")
        .text(tmp);
    }
  }

  v_index += 25;
  for (let c in classification) {
    let mincoord = Math.min.apply(
      0,
      classification[c].map((a) => {
        return h_coords[a] != undefined ? h_coords[a] : Infinity;
      })
    );
    let maxcoord =
      Math.max.apply(
        0,
        classification[c].map((a) => {
          return h_coords[a] != undefined ? h_coords[a] : -Infinity;
        })
      ) + square_height;

    svg
      .append("line")
      .attr("x1", mincoord)
      .attr("y1", padding.top)
      .attr("x2", maxcoord)
      .attr("y2", padding.top)
      .attr("stroke", color2)
      .attr("stroke-width", "4");

    svg
      .append("text")
      .attr("x", (mincoord + maxcoord) / 2)
      .attr("y", v_index + 15)
      .attr("text-anchor", "middle")
      .style("font-size", "0.6em")
      .style("fill", "gray")
      .text(c);

    svg
      .append("line")
      .attr("x1", mincoord - 10)
      .attr("y1", v_index)
      .attr("x2", maxcoord + 5)
      .attr("y2", v_index)
      .attr("stroke", "#ccc")
      .attr("stroke-width", "3");

    svg
      .append("line")
      .attr("x1", mincoord - 10)
      .attr("y1", v_index)
      .attr("x2", mincoord - 10)
      .attr("y2", v_index - 10)
      .attr("stroke", "#ccc")
      .attr("stroke-width", "3");

    svg
      .append("line")
      .attr("x1", maxcoord + 5)
      .attr("y1", v_index)
      .attr("x2", maxcoord + 5)
      .attr("y2", v_index - 10)
      .attr("stroke", "#ccc")
      .attr("stroke-width", "3");

    svg
      .append("line")
      .attr("x1", mincoord - 10)
      .attr("y1", v_index - 25)
      .attr("x2", maxcoord + 5)
      .attr("y2", v_index - 25)
      .attr("stroke", "#eee")
      .attr("stroke-width", "2");

    if (c != "Other")
      svg
        .append("line")
        .attr("x1", maxcoord + h_space_between_classifications / 2)
        .attr("y1", padding.top)
        .attr("x2", maxcoord + h_space_between_classifications / 2)
        .attr("y2", v_index - 10)
        .attr("stroke", "#ccc")
        .attr("stroke-dasharray", "5,5")
        .attr("stroke-width", "3");

    for (let c2 of classification[c]) {
      if (h_coords[c2] == undefined) continue;

      let tmp = Object.values(graph_feature_dict_total_counts).filter(
        (v) => v[c2] != undefined
      );

      svg
        .append("text")
        .attr("x", h_coords[c2] + 7)
        .attr("y", v_index - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "0.6em")
        .style("fill", "gray")
        .text(tmp.map((t) => t[c2]).reduce((a, b) => a + b, 0));
    }
  }

  svg.attr("viewBox", [
    0,
    0,
    h_index + padding.right,
    v_index + padding.bottom,
  ]);

  for (let graph_feature in graph_feature_dict) {
    svg
      .append("text")
      .attr("x", padding.left - 7)
      .attr("y", v_coords[graph_feature] + 12)
      .style("font-size", "0.8em")
      .style("text-anchor", "end")
      .text(graph_feature);
  }

  svg
    .append("text")
    .attr("x", padding.left - 7)
    .attr(
      "y",
      Math.max.apply(0, Object.values(v_coords)) + square_height * 2 + 5
    )
    .style("font-size", "0.8em")
    .style("text-anchor", "end")
    .style("fill", "gray")
    .style("font-style", "italic")
    .text("total");

  let g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (Math.max.apply(0, Object.values(h_coords)) + square_width * 2) +
        ", " +
        (padding.top - 7) +
        ")"
    );

  g.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("font-size", "0.8em")
    .style("text-anchor", "end")
    .style("fill", "gray")
    .style("font-style", "italic")
    .style("transform", "rotate(45deg)")
    .text("total");

  for (let group of Object.keys(classification)) {
    for (let c of classification[group]) {
      if (h_coords[c] == undefined) continue;

      let g = svg
        .append("g")
        .attr(
          "transform",
          "translate(" + +(h_coords[c] + 5) + ", " + (padding.top - 7) + ")"
        );

      g.append("text")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "end")
        .attr("transform", "rotate(45)")
        .style("font-size", "0.8em")
        .text(c);

      for (let graph_feature in graph_feature_dict) {
        if (c in graph_feature_dict[graph_feature]) {
          if (v_coords[graph_feature] == undefined) continue;
          svg
            .append("rect")
            .attr("x", h_coords[c])
            .attr("y", v_coords[graph_feature])
            .attr("width", square_width)
            .attr("height", square_height)
            .attr("fill", opts.color)
            // .attr("opacity", graph_feature_dict[graph_feature][c])
            .attr(
              "opacity",
              graph_feature_dict_total_counts[graph_feature][c] / 10
            );

          svg
            .append("text")
            .attr("x", h_coords[c] + square_width / 2)
            .attr("y", v_coords[graph_feature] + square_height / 2 + 3)
            .style("font-size", "0.6em")
            .style("text-anchor", "middle")
            .text(Math.round(graph_feature_dict_total_counts[graph_feature][c]))
            .style(
              "fill",
              graph_feature_dict_total_counts[graph_feature][c] < 8
                ? "black"
                : "white"
            );
        }
      }
    }
  }
}
