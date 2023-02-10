import pSBC from "shade-blend-color";

export function get_graph_features(entry) {
  let graph_features = entry["properties"]["Graph feature"]["multi_select"];
  let graph_feature_list = [];

  if (graph_features.length == 0) return graph_feature_list;
  if (graph_features[0]["name"] == "NA") return graph_feature_list;

  for (let graph_feature of graph_features) {
    graph_feature_list.push(graph_feature["name"]);
  }

  return graph_feature_list;
}

export function get_results_reported(entry) {
  let results_reported =
    entry["properties"]["Results measured"]["multi_select"];
  let results_reported_list = [];

  if (results_reported.length == 0) return results_reported_list;
  if (results_reported[0]["name"] == "NA") return results_reported_list;

  for (let result_reported of results_reported) {
    results_reported_list.push(result_reported["name"]);
  }

  return results_reported_list;
}

export function get_dataset_used(entry) {
  let graph_features = entry["properties"]["Dataset tag clean"]["multi_select"];
  let graph_feature_list = [];

  if (graph_features.length == 0) return graph_feature_list;
  if (graph_features[0]["name"] == "NA") return graph_feature_list;

  for (let graph_feature of graph_features) {
    graph_feature_list.push(graph_feature["name"]);
  }

  return graph_feature_list;
}

export function get_suppl_material_availability(entry) {
  let graph_features =
    entry["properties"]["Supplemental material (Multi-select)"]["multi_select"];
  let graph_feature_list = [];

  if (graph_features.length == 0) return graph_feature_list;
  if (graph_features[0]["name"] == "NA") return graph_feature_list;

  for (let graph_feature of graph_features) {
    graph_feature_list.push(graph_feature["name"]);
  }

  return graph_feature_list;
}

export function get_evaluation_type(entry) {
  let graph_features =
    entry["properties"]["Evaluation type (Multi-Select)"]["multi_select"];
  let graph_feature_list = [];

  if (graph_features.length == 0) return graph_feature_list;
  if (graph_features[0]["name"] == "NA") return graph_feature_list;

  for (let graph_feature of graph_features) {
    graph_feature_list.push(graph_feature["name"]);
  }

  return graph_feature_list;
}

export function get_provides_code(entry) {
  let graph_features = entry["properties"]["Does Provide Code"]["multi_select"];
  let graph_feature_list = [];

  if (graph_features.length == 0) return graph_feature_list;
  if (graph_features[0]["name"] == "NA") return graph_feature_list;

  for (let graph_feature of graph_features) {
    graph_feature_list.push(graph_feature["name"]);
  }

  return graph_feature_list;
}

export function get_year(entry) {
  if (entry["properties"]["year"]["rich_text"][0] == undefined)
    return undefined;
  let year = parseInt(
    entry["properties"]["year"]["rich_text"][0]["plain_text"]
  );
  return year;
}

export function get_title(entry) {
  return entry["properties"]["Name"]["title"][0]["plain_text"];
}

export function get_graph_size(entry) {
  if (
    entry["properties"]["Size of graphs (Clean up)"]["rich_text"][0] ==
    undefined
  )
    return undefined;
  let y =
    entry["properties"]["Size of graphs (Clean up)"]["rich_text"][0][
      "plain_text"
    ].split("-");
  return [parseInt(y[0]), parseInt(y[1])];
}

export function get_technique(entry) {
  let graph_features = entry["properties"]["Technique"]["multi_select"];
  let graph_feature_list = [];

  if (graph_features.length == 0) return graph_feature_list;
  if (graph_features[0]["name"] == "NA") return graph_feature_list;

  for (let graph_feature of graph_features) {
    graph_feature_list.push(graph_feature["name"]);
  }

  return graph_feature_list;
}

/*
    blend two colors to create the color that is at the percentage away from the first color
    this is a 5 step process
        1: validate input
        2: convert input to 6 char hex
        3: convert hex to rgb
        4: take the percentage to create a ratio between the two colors
        5: convert blend to hex
    @param: color1      => the first color, hex (ie: #000000)
    @param: color2      => the second color, hex (ie: #ffffff)
    @param: percentage  => the distance from the first color, as a decimal between 0 and 1 (ie: 0.5)
    @returns: string    => the third color, hex, represenatation of the blend between color1 and color2 at the given percentage
*/
export function blend_colors(color1, color2, percentage) {
  // check input
  color1 = color1 || "#000000";
  color2 = color2 || "#ffffff";
  percentage = percentage || 0.5;

  // 1: validate input, make sure we have provided a valid hex
  if (color1.length != 4 && color1.length != 7)
    throw new Error("colors must be provided as hexes");

  if (color2.length != 4 && color2.length != 7)
    throw new Error("colors must be provided as hexes");

  if (percentage > 1 || percentage < 0)
    throw new Error("percentage must be between 0 and 1");

  // output to canvas for proof
  // var cvs = document.createElement('canvas');
  // var ctx = cvs.getContext('2d');
  // cvs.width = 90;
  // cvs.height = 25;
  // document.body.appendChild(cvs);

  // color1 on the left
  // ctx.fillStyle = color1;
  // ctx.fillRect(0, 0, 30, 25);

  // color2 on the right
  // ctx.fillStyle = color2;
  // ctx.fillRect(60, 0, 30, 25);

  // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
  //      the three character hex is just a representation of the 6 hex where each character is repeated
  //      ie: #060 => #006600 (green)
  if (color1.length == 4)
    color1 =
      color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
  else color1 = color1.substring(1);
  if (color2.length == 4)
    color2 =
      color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
  else color2 = color2.substring(1);

  // console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);

  // 3: we have valid input, convert colors to rgb
  color1 = [
    parseInt(color1[0] + color1[1], 16),
    parseInt(color1[2] + color1[3], 16),
    parseInt(color1[4] + color1[5], 16),
  ];
  color2 = [
    parseInt(color2[0] + color2[1], 16),
    parseInt(color2[2] + color2[3], 16),
    parseInt(color2[4] + color2[5], 16),
  ];

  // console.log('hex -> rgba: c1 => [' + color1.join(', ') + '], c2 => [' + color2.join(', ') + ']');

  // 4: blend
  var color3 = [
    (1 - percentage) * color1[0] + percentage * color2[0],
    (1 - percentage) * color1[1] + percentage * color2[1],
    (1 - percentage) * color1[2] + percentage * color2[2],
  ];

  // console.log('c3 => [' + color3.join(', ') + ']');

  // 5: convert to hex
  let color4 =
    "#" + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);

  // console.log(color3);

  // color3 in the middle
  // ctx.fillStyle = color3;
  // ctx.fillRect(30, 0, 30, 25);

  // return hex
  return color4;
}

/*
    convert a Number to a two character hex string
    must round, or we will end up with more digits than expected (2)
    note: can also result in single digit, which will need to be padded with a 0 to the left
    @param: num         => the number to conver to hex
    @returns: string    => the hex representation of the provided number
*/
export function int_to_hex(num) {
  var hex = Math.round(num).toString(16);
  if (hex.length == 1) hex = "0" + hex;
  return hex;
}

// Version 4.0
// export const darken_color = (p, c0, c1, l) => {
//   let r,
//     g,
//     b,
//     P,
//     f,
//     t,
//     h,
//     i = parseInt,
//     m = Math.round,
//     a = typeof c1 == "string";
//   if (
//     typeof p != "number" ||
//     p < -1 ||
//     p > 1 ||
//     typeof c0 != "string" ||
//     (c0[0] != "r" && c0[0] != "#") ||
//     (c1 && !a)
//   )
//     return null;
//   if (!this.pSBCr)
//     this.pSBCr = (d) => {
//       let n = d.length,
//         x = {};
//       if (n > 9) {
//         ([r, g, b, a] = d = d.split(",")), (n = d.length);
//         if (n < 3 || n > 4) return null;
//         (x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4))),
//           (x.g = i(g)),
//           (x.b = i(b)),
//           (x.a = a ? parseFloat(a) : -1);
//       } else {
//         if (n == 8 || n == 6 || n < 4) return null;
//         if (n < 6)
//           d =
//             "#" +
//             d[1] +
//             d[1] +
//             d[2] +
//             d[2] +
//             d[3] +
//             d[3] +
//             (n > 4 ? d[4] + d[4] : "");
//         d = i(d.slice(1), 16);
//         if (n == 9 || n == 5)
//           (x.r = (d >> 24) & 255),
//             (x.g = (d >> 16) & 255),
//             (x.b = (d >> 8) & 255),
//             (x.a = m((d & 255) / 0.255) / 1000);
//         else
//           (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
//       }
//       return x;
//     };
//   (h = c0.length > 9),
//     (h = a ? (c1.length > 9 ? true : c1 == "c" ? !h : false) : h),
//     (f = this.pSBCr(c0)),
//     (P = p < 0),
//     (t =
//       c1 && c1 != "c"
//         ? this.pSBCr(c1)
//         : P
//         ? { r: 0, g: 0, b: 0, a: -1 }
//         : { r: 255, g: 255, b: 255, a: -1 }),
//     (p = P ? p * -1 : p),
//     (P = 1 - p);
//   if (!f || !t) return null;
//   if (l)
//     (r = m(P * f.r + p * t.r)),
//       (g = m(P * f.g + p * t.g)),
//       (b = m(P * f.b + p * t.b));
//   else
//     (r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5)),
//       (g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5)),
//       (b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5));
//   (a = f.a),
//     (t = t.a),
//     (f = a >= 0 || t >= 0),
//     (a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0);
//   if (h)
//     return (
//       "rgb" +
//       (f ? "a(" : "(") +
//       r +
//       "," +
//       g +
//       "," +
//       b +
//       (f ? "," + m(a * 1000) / 1000 : "") +
//       ")"
//     );
//   else
//     return (
//       "#" +
//       (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0))
//         .toString(16)
//         .slice(1, f ? undefined : -2)
//     );
// };
