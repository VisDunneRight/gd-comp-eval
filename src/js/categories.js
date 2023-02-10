export let graph_feature_color = "#b58900";
export let dataset_color = "#cb4b16";
export let dataset_size_color = "#dc322f";
export let size_of_graphs_color = "#d33682";
export let paper_type_color = "#6c71c4";
export let evaluation_type_color = "#268bd2";
export let metrics_color = "#2aa198";
export let accessibility_color = "#859900";

export let results_categories = {
  Size: ["Area", "Width", "Height", "Aspect Ratio"],
  Users: ["User Accuracy", "User Time", "User Usability", "User Preference"],
  ILP: ["Num Vars/Constraints", "Optimality Rate", "Success Rate (LP)"],
  Structure: [
    "Structure Preservation",
    "Displacement",
    "Distortion",
    "Spread Minimization",
    "Node Movement Minimization",
    "Neighborhood Preservation",
    "Stress",
    "Energy",
    "Density",
  ],
  Computation: ["Running Time", "Memory Used", "Iterations"],
  Aesthetics: [
    "Num Crossings",
    "Edge Length",
    "Edge Bends",
    "Angular Resolution",
    "Edge Length Deviation",
    "Vertex Resolution",
    "Crossing Angle",
  ],
  Clustering: ["Clustering Quality", "Amount of Clusters", "Cluster Overlap"],
  Other: ["Observations"],
};

export let dataset_categories = {
  // "edited": ["Rome-Lib*", "AT&T*", "North DAG*"],
  custom: [
    "Custom (Non Replicable)",
    "Custom (Replicable)",
    "Custom (Reproducible)",
    "undisclosed",
  ],
  named: [
    "Rome-Lib",
    "Graphviz Examples",
    "Enron",
    "North DAG",
    "Stanford GraphBase",
    "SNAP",
    "C. Walshaw's graph collection",
    "AT&T",
    "Matrix Market",
    "SuiteSparse Matrix Collection",
  ],
  Other: [],
};

export let graph_feature_categories = {
  Layered: ["Layered graphs", "N-layers", "Bipartite"],
  Hierarchical: ["Trees", "Binary Trees", "Hierarchical"],
  "Time-Related": ["Dynamic", "Dynamic - discrete", "Dynamic - continuous"],
  Structures: [
    "Weighted Edges",
    "Hypergraphs",
    "Categorical Nodes",
    "DAG",
    "Directed Edges",
    "Labeled Nodes",
    "Labeled Edges",
    "Compound graphs",
    "Clusters (pre-existing)",
    "Clusters (generated)",
  ],
  Imprecise: ["Large", "High degree", "Sparse Graphs"],
  Other: ["Generic", "Book Embedding"],
};

export let evaluation_type_categories = {
  "User Studies": [
    "User Study",
    "User Study x2",
    "Expert Interview",
    "Informal User Study",
  ],
  Quantitative: ["Quantitative Individual", "Quantitative Aggregated"],
  Other: [],
};

export let technique_categories = {
  Other: [
    "ILP",
    "force-directed",
    "machine learning",
    "Barycentric",
    "other",
    "multidimensional scaling",
    "Spectral",
    "Spectral Sparsification",
  ],
};
