function draw_property_distribution(data, div){
    let bar_height = 15
    let unit_width = 500
    let colors = d3.schemeTableau10
    let num_entries = data.length

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
        "Does Provide Code"
        ]

    for (let p of property_list){
        div.append("div").text(p)

        let svg = div.append("svg")
            .attr("width", 1000)
            .attr("height", 500)
            .style("margin", "15px")

        let countdict = {}
        for (let entry of data){
            let cur_property = entry["properties"][p]

            if (cur_property["type"] == "multi_select"){
                // this will work for multi_select properties, need to change it for other types
                for (let value of cur_property["multi_select"]){
                    let name = value["name"]
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

        let keylist = Object.keys(countdict).sort((a, b) => countdict[b] > countdict[a])

        for (let key of keylist){

            // property name
            svg.append("text")
                .attr("x", 190)
                .attr("y", bar_height*.7 + keylist.indexOf(key) * bar_height)
                .style("font-size", "0.7em")
                .text(key)
                .style("text-anchor", "end")

            // square
            svg.append("rect")
                .attr("x", 220)
                .attr("y", keylist.indexOf(key)*bar_height)
                .attr("width", bar_height*.9)
                .attr("height", bar_height*.9)
                .attr("fill", d3.interpolateOranges(countdict[key]/num_entries))

            // count
            svg.append("text")
                .attr("x", 200)
                .attr("y", bar_height*.7 + keylist.indexOf(key) * bar_height)
                .text(countdict[key])
                .style("fill", "black")
                .style("font-size", "0.6em")
        }

        svg.attr("height", keylist.length * bar_height)
    }
}