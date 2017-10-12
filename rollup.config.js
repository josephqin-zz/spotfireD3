import ascii from "rollup-plugin-ascii";
import node from "rollup-plugin-node-resolve";
import babel from 'rollup-plugin-babel';

export default {
  input: "src/spotfirePanel",
  extend: true,
  plugins: [node(), ascii()],
  external: ['d3'],
  globals: {
    d3: 'd3'
  },
  output: {
    file: "build/spotfirePanel.js",
    format: "umd",
    name: "spotfirePanel"
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
  
};
