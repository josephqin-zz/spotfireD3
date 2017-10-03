import ascii from "rollup-plugin-ascii";
import node from "rollup-plugin-node-resolve";

export default {
  input: "src/spotfirePanel.js",
  extend: true,
  plugins: [node(), ascii()],
  // external: ['d3'],
  globals: {
    d3: 'd3'
  },
  output: {
    file: "build/spotfirePanel_node.js",
    format: "cjs"
  }
  
};
