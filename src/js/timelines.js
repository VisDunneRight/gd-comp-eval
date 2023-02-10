import {
  get_year,
  get_results_reported,
  get_dataset_used,
  get_evaluation_type,
  get_suppl_material_availability,
  //   darken_color,
  get_provides_code,
} from "./util";
import * as d3 from "d3";

let spectral_colorscheme = [
  "#9e0142",
  "#d53e4f",
  "#f46d43",
  "#fdae61",
  "#fee08b",
  "#ffffbf",
  "#e6f598",
  "#abdda4",
  "#66c2a5",
  "#3288bd",
  "#5e4fa2",
];
let gruvbox_colorscheme = [
  "#fb4934",
  "#b8bb26",
  "#fabd2f",
  "#83a598",
  "#d3869b",
  "#8ec07c",
  "#fe8019",
  "#d65d0e",
  "#b16286",
  "#a89984",
  "#928374",
  "#7c6f64",
  "#665c54",
  "#504945",
  "#3c3836",
  "#282828",
];
let solarized_light_colorscheme = [
  "#b58900",
  "#cb4b16",
  "#dc322f",
  "#d33682",
  "#6c71c4",
  "#268bd2",
  "#2aa198",
  "#859900",
];
let categorical_colorscheme = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

export function draw_suppl_material_by_year(data, div) {
  let options = {
    x_function: get_year,
    y_function: get_suppl_material_availability,
    replace_words: [
      ["dead link", "Dead Link"],
      ["no", "No"],
      ["video", "Video"],
      ["appendix", "Appendix"],
    ],
    skip_words: ["Yes"],
    colorscheme: spectral_colorscheme,
    title: "Supplemental Material Over the Years",
  };

  draw_stacked_barchart(data, div, options);
}

export function draw_provides_code_over_the_years(data, div) {
  let options = {
    x_function: get_year,
    y_function: get_provides_code,
    replace_words: [["No but implemented by others", "Implemented by others"]],
    colorscheme: spectral_colorscheme,
    title: "Code Availability Over the Years",
  };

  draw_stacked_barchart(data, div, options);
}

export function draw_results_measured_over_the_years(data, div) {
  let options = {
    x_function: get_year,
    y_function: get_results_reported,
    colorscheme: spectral_colorscheme,
    title: "Results Measured Over the Years",
  };

  draw_stacked_barchart(data, div, options);
}

export function draw_evaluation_type_over_the_years(data, div) {
  let options = {
    x_function: get_year,
    y_function: get_evaluation_type,
    replace_words: [
      ["Informal User Study", "User Study"],
      ["User Study x2", "User Study"],
    ],
    colorscheme: spectral_colorscheme,
    title: "Evaluation Types Over the Years",
  };

  draw_stacked_barchart(data, div, options);
}

export function draw_datasets_used_over_the_years(data, div) {
  let options = {
    x_function: get_year,
    y_function: get_dataset_used,
    replace_words: [
      ["Rome-Lib*", "Rome-Lib"],
      ["Custom (Non Replicable)", "Custom"],
      ["Custom (Replicable)", "Custom"],
      ["Custom (Reproducible)", "Custom"],
      ["C. Walshaw's graph collection", "C. Walshaw"],
      ["Transportation Network/Map", "Map"],
      ["Airlines/Migration Routes", "Airlines"],
    ],
    colorscheme: spectral_colorscheme,
    title: "Datasets Used Over the Years",
  };

  draw_stacked_barchart(data, div, options);
}

export function draw_timeline(data, div) {
  for (let entry of data) {
    if (get_year(entry) == undefined) continue;
    // console.log(get_year(entry))
  }
}

export function draw_stacked_barchart(data, div, opts) {
  let bar_width = 20;
  let bar_dist = 2;
  let total_height = 200;
  let padding = { left: 80, right: 150, top: 30, bottom: 30 };
  let groupby = 2;

  let datedict = {};
  let valdict = {};

  for (let entry of data) {
    if (opts.x_function(entry) == undefined) continue;

    if (datedict[opts.x_function(entry)] == undefined)
      datedict[opts.x_function(entry)] = {};
    for (let el of opts.y_function(entry)) {
      if (
        el == "none" ||
        (opts.skip_words != undefined && opts.skip_words.includes(el))
      )
        continue;

      if (opts.replace_words != undefined)
        for (let word of opts.replace_words) {
          if (el == word[0]) el = word[1];
        }

      if (datedict[opts.x_function(entry)][el] == undefined)
        datedict[opts.x_function(entry)][el] = 0;
      datedict[opts.x_function(entry)][el] += 1;

      if (valdict[el] == undefined) valdict[el] = 0;
      valdict[el] += 1;
    }
  }

  let firstyear = 2000;
  let lastyear = 2021;

  let maxval = Object.values(datedict)
    .map((a) => Object.values(a))
    .filter((a) => a.length != 0)
    .map((a) => a.reduce((a, b) => a + b))
    .reduce((a, b) => Math.max(a, b));
  let unit_height = (total_height - padding.bottom - padding.top) / maxval;

  let vals = [
    ...new Set(
      Object.values(datedict)
        .map((a) => Object.keys(a))
        .flat()
    ),
  ].sort((a, b) => valdict[b] - valdict[a]);

  if (vals.length > 9) {
    vals = vals.slice(0, 9);
    vals.push("Other");

    for (let year in datedict) {
      for (let val in datedict[year]) {
        if (!vals.includes(val)) {
          if (datedict[year]["Other"] == undefined) datedict[year]["Other"] = 0;
          datedict[year]["Other"] += datedict[year][val];
          delete datedict[year][val];
        }
      }
    }
  }

  let years = Object.keys(datedict).sort();

  let w =
    (lastyear - firstyear) * (bar_width + bar_dist) +
    padding.left +
    padding.right;

  let svg = div.append("svg").attr("viewBox", [0, 0, w, total_height]);

  let legend = svg
    .append("g")
    .attr(
      "transform",
      `translate(${w - padding.right + 20}, ${
        total_height - padding.bottom * 2 - 95
      })`
    );
  for (let val of vals) {
    legend
      .append("circle")
      .attr("cx", 0)
      .attr("cy", vals.indexOf(val) * 13)
      .attr("r", 5)
      .attr(
        "stroke",
        opts.colorscheme[vals.indexOf(val) % opts.colorscheme.length]
        // darken_color(
        //   -0.4,
        //   opts.colorscheme[vals.indexOf(val) % opts.colorscheme.length]
        // )
      )
      .attr("stroke-width", 2)
      .attr(
        "fill",
        opts.colorscheme[vals.indexOf(val) % opts.colorscheme.length]
      );

    legend
      .append("text")
      .text(val)
      .attr("x", 10)
      .attr("y", vals.indexOf(val) * 13 + 5)
      .attr("font-size", "0.8em");
  }

  if (opts.title != undefined) {
    svg
      .append("text")
      .attr("x", w / 2)
      .attr("y", padding.top - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "0.8em")
      .style("font-weight", "bold")
      .text(opts.title);
  }

  // left axis
  svg
    .append("text")
    .attr("x", padding.left - 25)
    .attr("y", total_height - padding.bottom * 2 - 95)
    .attr("font-size", "0.8em")
    .attr("text-anchor", "end")
    .text("100% -");

  svg
    .append("text")
    .attr("x", padding.left - 25)
    .attr("y", total_height - padding.bottom * 2 + 2)
    .attr("font-size", "0.8em")
    .attr("text-anchor", "end")
    .text("0% -");

  let valfound = [];
  let paths = {};

  for (let val of vals) {
    let pathpoints = [];

    for (let year = firstyear; year <= lastyear; year += groupby) {
      let g = svg
        .append("g")
        .attr(
          "transform",
          "translate(" +
            ((year - firstyear) * (bar_width + bar_dist) + padding.left) +
            "," +
            (total_height - padding.bottom) +
            ")"
        );

      let textg = g
        .append("g")
        .attr("transform", "translate(" + -bar_width * 0.6 + ", 0)");

      textg
        .append("text")
        .attr("x", 0)
        .attr("y", 5)
        .attr("transform", "rotate(-45)")
        .attr("font-size", "0.7em")
        .text(year);

      let total_dict = {};
      let ratio_dict = {};

      for (let i = 0; i < groupby; i++) {
        // console.log(year + i, datedict[year + i])
        if (datedict[year + i] == undefined) continue;
        for (let entry in datedict[year + i]) {
          if (total_dict[entry] == undefined) total_dict[entry] = 0;
          total_dict[entry] += datedict[year + i][entry];
        }
      }

      for (let entry in total_dict) {
        ratio_dict[entry] =
          total_dict[entry] / Object.values(total_dict).reduce((a, b) => a + b);
      }

      let h = 0;
      if (ratio_dict[val] == undefined) {
        // if (!valfound.includes(val)) h = 1;
        h = 0;
      } else {
        valfound.push(val);
        h = ratio_dict[val];
        let sum = 0;
        for (let i = 0; i < vals.indexOf(val); i++) {
          // console.log(vals[i])
          if (ratio_dict[vals[i]] == undefined) continue;
          sum += ratio_dict[vals[i]];
        }
        h += sum;
      }

      // console.log(val, year, ratio_dict, h)

      // else h = (ratio_dict[val])

      // // let h = ratio_dict[val] * 100
      // if (prevsumdict[year] == undefined) prevsumdict[year] = {}
      // let sum = Object.values(prevsumdict[year]).reduce((a, b) => a + b, 0)
      // prevsumdict[year][val] = h;
      // if (valfound.includes(val)){
      pathpoints.push([
        (year - firstyear - 1) * (bar_width + bar_dist) + padding.left,
        total_height - padding.bottom * 2 - h * 100,
      ]);
      pathpoints.push([
        (year - firstyear) * (bar_width + bar_dist) + padding.left,
        total_height - padding.bottom * 2 - h * 100,
      ]);
      pathpoints.push([
        (year - firstyear + 1) * (bar_width + bar_dist) + padding.left,
        total_height - padding.bottom * 2 - h * 100,
      ]);
      // } else {
      // pathpoints.push([(year - firstyear - 1) * (bar_width + bar_dist) + padding.left, total_height - 100 - padding.bottom*2])
      // pathpoints.push([(year - firstyear) * (bar_width + bar_dist) + padding.left, total_height - 100 - padding.bottom*2])
      // pathpoints.push([(year - firstyear + 1) * (bar_width + bar_dist) + padding.left, total_height - 100 - padding.bottom*2])
      // }
    }

    // if (vals.indexOf(val) == vals.length - 1){
    //     pathpoints = []
    //     for (let year = firstyear; year <= lastyear; year+=groupby){
    //         pathpoints.push([(year - firstyear - 1) * (bar_width + bar_dist) + padding.left, total_height - 100 - padding.bottom*2])
    //         pathpoints.push([(year - firstyear) * (bar_width + bar_dist) + padding.left, total_height - 100 - padding.bottom*2])
    //         pathpoints.push([(year - firstyear + 1) * (bar_width + bar_dist) + padding.left, total_height - 100 - padding.bottom*2])
    //     }
    // }

    // console.log("prevsumdict", prevsumdict)
    // console.log("pathpoints", pathpoints)

    pathpoints.push(pathpoints[pathpoints.length - 1]);
    pathpoints.push(pathpoints[pathpoints.length - 1]);
    pathpoints.push([
      (lastyear - firstyear) * (bar_width + bar_dist) + padding.left,
      total_height - padding.bottom * 2,
    ]);
    pathpoints.push([
      (lastyear - firstyear) * (bar_width + bar_dist) + padding.left,
      total_height - padding.bottom * 2,
    ]);
    pathpoints.push([
      (lastyear - firstyear) * (bar_width + bar_dist) + padding.left,
      total_height - padding.bottom * 2,
    ]);
    pathpoints.push([
      padding.left - (bar_width + bar_dist),
      total_height - padding.bottom * 2,
    ]);
    pathpoints.push([
      padding.left - (bar_width + bar_dist),
      total_height - padding.bottom * 2,
    ]);
    pathpoints.push([
      padding.left - (bar_width + bar_dist),
      total_height - padding.bottom * 2,
    ]);
    pathpoints.push([
      padding.left - (bar_width + bar_dist),
      total_height - padding.bottom * 2 - 100,
    ]);

    paths[val] = pathpoints;
  }

  let reversedvals = vals.slice().reverse();
  for (let val of reversedvals) {
    let line = d3.line().curve(d3.curveBasis);

    svg
      .append("path")
      // .attr("d", d3.line()(prevpathpoints.concat(pathpoints)))
      .attr("d", line(paths[val]))
      .attr(
        "stroke",
        // darken_color(
        //   -0.4,
        opts.colorscheme[vals.indexOf(val) % opts.colorscheme.length]
        // )
      )
      .attr("stroke-width", 2)
      .attr(
        "fill",
        opts.colorscheme[vals.indexOf(val) % opts.colorscheme.length]
      );
    // .attr("fill", "none")
  }
}

export function draw_stacked_barchart2(data, div, opts) {
  let bar_width = 20;
  let bar_dist = 2;
  let total_height = 300;
  let padding = { left: 30, right: 30, top: 0, bottom: 30 };

  let datedict = {};
  let valdict = {};
  for (let entry of data) {
    if (opts.x_function(entry) == undefined) continue;

    if (datedict[opts.x_function(entry)] == undefined)
      datedict[opts.x_function(entry)] = {};
    for (let el of opts.y_function(entry)) {
      if (el == "none") continue;
      if (datedict[opts.x_function(entry)][el] == undefined)
        datedict[opts.x_function(entry)][el] = 0;
      datedict[opts.x_function(entry)][el] += 1;

      if (valdict[el] == undefined) valdict[el] = 0;
      valdict[el] += 1;
    }
  }

  let firstyear = 1981;
  let lastyear = 2021;

  let maxval = Object.values(datedict)
    .map((a) => Object.values(a))
    .filter((a) => a.length != 0)
    .map((a) => a.reduce((a, b) => a + b))
    .reduce((a, b) => Math.max(a, b));
  let unit_height = (total_height - padding.bottom - padding.top) / maxval;

  let vals = [
    ...new Set(
      Object.values(datedict)
        .map((a) => Object.keys(a))
        .flat()
    ),
  ]
    .sort((a, b) => valdict[b] - valdict[a])
    .slice(0, 10);

  let years = Object.keys(datedict).sort();

  let w =
    (lastyear - firstyear) * (bar_width + bar_dist) +
    padding.left +
    padding.right;

  let svg = div.append("svg").attr("viewBox", [0, 0, w, total_height]);

  let legend = svg
    .append("g")
    .attr("transform", `translate(${padding.left}, ${padding.top})`);
  for (let val of vals) {
    legend
      .append("circle")
      .attr("cx", 0)
      .attr("cy", vals.indexOf(val) * 15)
      .attr("r", 5)
      .attr(
        "fill",
        d3.schemeTableau10[vals.indexOf(val) % d3.schemeTableau10.length]
      );

    legend
      .append("text")
      .text(val)
      .attr("x", 10)
      .attr("y", vals.indexOf(val) * 15 + 5)
      .attr("font-size", "small");
  }

  for (let year = firstyear; year <= lastyear; year++) {
    let g = svg
      .append("g")
      .attr(
        "transform",
        "translate(" +
          ((year - firstyear) * (bar_width + bar_dist) + padding.left) +
          "," +
          (total_height - padding.bottom) +
          ")"
      );

    let textg = g
      .append("g")
      .attr("transform", "translate(" + -bar_width * 0.6 + ", 0)");

    textg
      .append("text")
      .attr("x", 0)
      .attr("y", 5)
      .attr("transform", "rotate(-45)")
      .attr("font-size", "small")
      .text(year);

    let sum = 0;
    for (let val of vals) {
      if (datedict[year] == undefined) continue;
      if (datedict[year][val] == undefined) continue;
      let h = datedict[year][val] * unit_height;

      g.append("rect")
        .attr("x", 0)
        .attr("y", -h - padding.bottom - sum)
        .attr("width", bar_width)
        .attr("height", h)
        .attr(
          "fill",
          d3.schemeTableau10[vals.indexOf(val) % d3.schemeTableau10.length]
        );

      sum += h;
    }
  }
}
