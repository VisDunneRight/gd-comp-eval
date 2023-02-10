function draw_latex_property_distribution(data, div){
    let num_entries = data.length;
    let colornames = ["RubineRed", "Aquamarine", "Peach"]

    // let property_list = Object.keys(data[0]["properties"])
    let property_list = ["Supplemental material (Multi-select)", 
        "Type of storage for supplemental material",
        "Type of edit to the dataset",
        "Graph feature",
        "Evaluation type (Multi-Select)",
        "Results measured",
        "Evaluation qual/quant",
        "Dataset tag clean",
        "Easy to find info about graphs?",
        "paper type",
        "Does Provide Code",
        "Technique"
        ]

    let s = ""

    for (let p of property_list){
        
        s += "\\begin{figure}[] \n"
        // s += "\\scriptsize \n"
        s += "\\renewcommand{\\arraystretch}{1.2}"
        s += "\\fontfamily{phv}\\selectfont"
        s += "\\begin{tabular}{ >{\\raggedleft\\arraybackslash} m{1.5cm}  >{\\raggedleft\\arraybackslash} m{4cm} c c} \n"
        s += "\\multicolumn{4}{c}{\\textbf{" + p + '}} \\\\ \n'
        // s += "\\hline \n"

        let countdict = {}
        for (let entry of data){
            let cur_property = entry["properties"][p]

            if (cur_property["type"] == "multi_select"){
                // this will work for multi_select properties, need to change it for other types
                for (let value of cur_property["multi_select"]){
                    let name = value["name"].replace("&", "\\&")
                    if (countdict[name] == undefined){
                        countdict[name] = 1
                    } else {
                        countdict[name] += 1
                    }
                }
            } else if (cur_property["type"] == "checkbox") {
                if (cur_property["checkbox"] == true){
                    if (countdict["true"] == undefined){
                        countdict["true"] = 1
                    } else {
                        countdict["true"] += 1
                    }
                } else {
                    if (countdict["false"] == undefined){
                        countdict["false"] = 1
                    } else {
                        countdict["false"] += 1
                    }
                }
            } else if (cur_property["type"] == "rich_text") {
                // console.log(cur_property["rich_text"])
            } else {
                // console.log("failed to parse:", cur_property)
            }

        }

        let categories = {}
        if (p == "Graph feature") categories = graph_feature_categories
        if (p == "Dataset tag clean") categories = dataset_categories
        if (p == "Results measured") categories = results_categories
        if (p == "Evaluation type (Multi-Select)") categories = evaluation_type_categories;
        let categories_added = [];

        let color = graph_feature_color;
        if (p == "Graph feature") color = "graph_feature_color";
        if (p == "Dataset") color = "dataset_color";
        if (p == "Evaluation type (Multi-Select)") color = "evaluation_type_color";

        let d = {
            "other": []
        }

        for (let key of Object.keys(countdict)){
            if (countdict[key] <= 1) continue
            let keycategory = Object.keys(categories).find(c => categories[c].includes(key))
            if (keycategory == undefined){
                d["other"].push(key)
            } else {
                // console.log("aaa")
                if (d[keycategory] == undefined) d[keycategory] = []
                d[keycategory].push(key)
            }
        }

        for (let c of Object.keys(d).sort((a, b) => {
            if (a == "other") return 1
            if (b == "other") return -1
            return 0
        })){
            // if (Object.keys(d).indexOf(c) < Object.keys(d).length) s += "\\arrayrulecolor{gray}\\hline \n"
            d[c] = d[c].sort((a, b) => countdict[b] - countdict[a])

            if (c != "other") {
                s += "\\multirow{" + (d[c].length) + "}{*}{" + c + " $\\begin{cases}"
                for (let key of d[c]){
                    s += " \\\\ "
                }
                s += "\\end{cases}$ }\n"
            }

            for (let key of d[c]){
                let name = key.replace("&", "\\&")
                s += 
                " & " + key
                + " & \\raisebox{0.1cm}{\\fcolorbox{black}{" + 
                    color + "!" + Math.round(250*countdict[key]/num_entries) 
                + "}{\\rule{0pt}{0pt}\\rule{0pt}{0pt}}\\quad}"
                + " & " + countdict[key]
                + '\\\\ \n'
            }

            // console.log(Object.keys(d).indexOf(c))
            // if (Object.keys(d).indexOf(c) < Object.keys(d).length - 2) 

            s += "\\\\ \n"
        }

        s += "\\end{tabular} \n"
        s += "\\end{figure} \n\n"

    }

    div.append("div").text(s)
    // console.log(s)
}

function draw_latex_dataset_mentions(data, div){
    let colors = ["nl_gray", "nl_brown", "nl_orange", "nl_yellow", "nl_green", "nl_blue", "nl_purple", "nl_pink", "nl_red"]
    let s = "";
    
    s += "\\begin{figure*}[] \n"
    // s += "\\renewcommand{\\arraystretch}{1.2}"
    s += "\\fontfamily{phv}\\selectfont\\tiny \n"
    // s += "\\begin{tabular}{>{\\arraybackslash\\raggedleft}m{1cm} m{16cm}} \n"
    s += "\\begin{tabular}{m{16cm} m{0cm}} \n"
    // s += "\\multicolumn{4}{c}{\\textbf{" + p + '}} \\\\ \n'

    let color_dict = {}
    let feature_dict = {}

    for (let entry of data){
        let ds = get_dataset_used(entry).filter(e => e != "none" && !e.includes("custom"))
        if (ds.length == 0) continue;

        for (let feature of get_graph_features(entry)){
            if (feature_dict[feature] == undefined) feature_dict[feature] = {};
            for (let dataset of ds){
                dataset = dataset.replace("*", "").replace("&", "\\&")

                if (color_dict[dataset] == undefined){
                    color_dict[dataset] = colors[Object.keys(color_dict).length % colors.length]
                }

                if (feature_dict[feature][dataset] == undefined) feature_dict[feature][dataset] = [];
                if (entry["properties"]["Citation name"]["rich_text"].length == 0) continue;
                feature_dict[feature][dataset].push(entry["properties"]["Citation name"]["rich_text"][0]["plain_text"])
            }
        }
    }

    for (let feature of Object.keys(feature_dict)){
        if (feature == "Dynamic" || feature == "Circular") continue;

        s += "\\textbf{" + feature + ":} "
        
        keylist = Object.keys(feature_dict[feature]).sort((a, b) => feature_dict[feature][b].length - feature_dict[feature][a].length)

        for (let dataset of keylist){
            if (dataset == "causes of x" || dataset == "Custom (Non Replicable)" || dataset == "Custom (Replicable)"
                || dataset == "Rome-Lib*" || dataset == "AT\\&T*" || dataset == "North DAG*" || dataset == "matrix market?") continue;
            
            feature_dict[feature][dataset] = [... new Set(feature_dict[feature][dataset])]
            
            s += "\\colortext{" + color_dict[dataset] + "}{" + dataset + "} "
            s += "\\cite{" + feature_dict[feature][dataset].join(", ") + "} --- "
        }
        // s = s.substring(0, s.length - 3);
        s += "\\\\ \\arrayrulecolor{lightgray}\\hline \n \n"
    }

    s += "\\end{tabular} \n"
    s += "\\end{figure*} \n\n"

    div.append("div").text(s)
    // console.log(s)
}