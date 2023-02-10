export function draw_num_samples_by_evaluation_type(data, div) {
  let svg = div.append("svg").attr("viewBox", [0, 0, 700, 500]);
  // .attr("width", 1500)
  // .attr("height", 10000)
  // .style("margin", "15px")

  let evaluation_types_list = new Set();
  let evaluation_types_medians = {};
  let evaluation_type_means = {};
  let evaluation_dict = {};
  let buckets = [
    [0, 10],
    [10, 100],
    [100, 1000],
    [1000, 10000],
    [10000, 100000],
    [100000, 1000000],
  ];

  for (let entry of data) {
    let evaluation_types =
      entry["properties"]["Evaluation type (Multi-Select)"]["multi_select"];

    if (evaluation_types.length == 0) continue;
    if (evaluation_types[0]["name"] == "NA") continue;

    for (let evaluation_type of evaluation_types) {
      if (evaluation_type["name"] == "User Study x2")
        evaluation_type["name"] = "User Study / Interview";
      if (evaluation_type["name"] == "User Study")
        evaluation_type["name"] = "User Study / Interview";
      if (evaluation_type["name"] == "Informal User Study")
        evaluation_type["name"] = "User Study / Interview";
      if (evaluation_type["name"] == "Expert Interview")
        evaluation_type["name"] = "User Study / Interview";

      evaluation_types_list.add(evaluation_type["name"]);

      if (evaluation_dict[evaluation_type["name"]] == undefined) {
        evaluation_dict[evaluation_type["name"]] = {};
      }

      if (entry["properties"]["dataset size"]["rich_text"][0] == undefined)
        continue;
      if (
        entry["properties"]["dataset size"]["rich_text"][0]["plain_text"] ==
        "NA"
      )
        continue;
      if (
        entry["properties"]["dataset size"]["rich_text"][0]["plain_text"] ==
        "N/A"
      )
        continue;

      let num_samples = eval(
        entry["properties"]["dataset size"]["rich_text"][0]["plain_text"]
      );

      if (evaluation_types_medians[evaluation_type["name"]] == undefined) {
        evaluation_types_medians[evaluation_type["name"]] = [];
        evaluation_type_means[evaluation_type["name"]] = [];
      }
      evaluation_types_medians[evaluation_type["name"]].push(num_samples);
      evaluation_type_means[evaluation_type["name"]].push(num_samples);

      for (let bucket of buckets) {
        if (num_samples >= bucket[0] && num_samples < bucket[1]) {
          if (evaluation_dict[evaluation_type["name"]][bucket] == undefined) {
            evaluation_dict[evaluation_type["name"]][bucket] = 1;
          } else {
            evaluation_dict[evaluation_type["name"]][bucket] += 1;
          }
        }
      }
    }
  }

  for (let evaluation of Object.keys(evaluation_dict)) {
    // if (evaluation == "User Study x2") continue;
    // if (evaluation == "Informal User Study") continue;
    // if (evaluation == "Informal User Study") continue;

    let barchart_height = 200;
    let barchart_width = 200;
    let unit_height = 3;
    let chartindex = Object.keys(evaluation_dict).indexOf(evaluation);

    let g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          (chartindex % 3) * barchart_width +
          ", " +
          Math.floor(chartindex / 3) * barchart_height +
          ")"
      );

    g.append("text")
      .text(evaluation)
      .attr("x", barchart_width / 2)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .style("font-size", "0.9em");

    let mean = d3.mean(evaluation_type_means[evaluation]);
    let median = d3.median(evaluation_types_medians[evaluation]);

    g.append("text")
      .text("Median: " + Math.round(median))
      .attr("x", barchart_width / 2)
      .attr("y", 60)
      .attr("text-anchor", "middle")
      .style("font-size", "0.8em")
      .style("fill", "#666");

    for (let bucket of buckets) {
      let rect_height = unit_height * evaluation_dict[evaluation][bucket];

      if (evaluation_dict[evaluation][bucket] == undefined) continue;

      g.append("rect")
        .attr("x", (buckets.indexOf(bucket) * barchart_width) / buckets.length)
        .attr("y", barchart_height - rect_height)
        .attr("width", (barchart_width / buckets.length) * 0.8)
        .attr("height", rect_height)
        .style(
          "fill",
          blend_colors(dataset_size_color, evaluation_type_color, 0.5)
        );

      g.append("text")
        .attr(
          "x",
          (buckets.indexOf(bucket) * barchart_width) / buckets.length +
            (barchart_width / buckets.length) * 0.4
        )
        .attr("y", barchart_height - rect_height - 5)
        .text(evaluation_dict[evaluation][bucket])
        .style("font-size", "0.8em")
        .style("text-anchor", "middle");
    }

    for (let i = 1; i < 3; i++) {
      svg
        .append("line")
        .attr("x1", i * barchart_width - 3)
        .attr("y1", 0)
        .attr("x2", i * barchart_width - 3)
        .attr("y2", barchart_height * 2)
        .style("stroke", "#ccc")
        .style("stroke-width", 2);
    }

    for (let i = 1; i < 2; i++) {
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", i * barchart_height + 3)
        .attr("x2", barchart_width * 3)
        .attr("y2", i * barchart_height + 3)
        .style("stroke", "#ccc")
        .style("stroke-width", 2);
    }

    for (let i = 0; i < 3; i++) {
      for (let bucket of buckets) {
        let g = svg
          .append("g")
          .attr(
            "transform",
            "translate(" +
              (i * barchart_width +
                (buckets.indexOf(bucket) * barchart_width) / buckets.length +
                (barchart_width / buckets.length) * 0.45) +
              "," +
              (barchart_height + 15 + barchart_height) +
              ")"
          );

        let b1 = bucket[0];
        if (b1 == 100) b1 = "10^2";
        if (b1 == 1000) b1 = "10^3";
        if (b1 == 10000) b1 = "10^4";
        if (b1 == 100000) b1 = "10^5";

        let b2 = bucket[1];
        if (b2 == 100) b2 = "10^2";
        if (b2 == 1000) b2 = "10^3";
        if (b2 == 10000) b2 = "10^4";
        if (b2 == 100000) b2 = "10^5";
        if (b2 == 1000000) b2 = "10^6";

        g.append("text")
          .text(b1 + " - " + b2)
          .style("font-size", "0.7em")
          .style("text-anchor", "start")
          .attr("transform", "rotate(45)");

        svg
          .append("line")
          .attr(
            "x1",
            i * barchart_width +
              (buckets.indexOf(bucket) * barchart_width) / buckets.length +
              barchart_width / buckets.length -
              3
          )
          .attr("y1", 0)
          .attr(
            "x2",
            i * barchart_width +
              (buckets.indexOf(bucket) * barchart_width) / buckets.length +
              barchart_width / buckets.length -
              3
          )
          .attr("y2", barchart_height * 2)
          .attr("stroke", "#ccc")
          .style("stroke-dasharray", "3, 10");
      }
    }
  }
}
