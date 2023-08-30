import resolve from "rollup-plugin-node-resolve";
import vue from "rollup-plugin-vue";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";
import less from "rollup-plugin-less";

export default [
  {
    input: "build/entry.js",
    output: {
      format: "umd",
      file: "dist/datav.map.vue.js",
      name: "datav",
      globals: {
        vue: "Vue"
      }
    },
    plugins: [
      vue(),
      resolve(),
      // babel({
      //   exclude: "node_modules/**"
      // }),
      commonjs(),
      postcss()
    ],
    external: ["Vue"]
  },
  {
    input: "build/esm.entry.js",
    output: {
      format: "esm",
      file: "dist/datav.map.vue.esm.js",
      name: "datav"
    },
    plugins: [
      vue(),
      postcss(),
      resolve(),
      babel({
        exclude: "node_modules/**"
      }),
      commonjs()
    ],
    external: ["vue"]
  },
  {
    input: "build/cjs.entry.js",
    output: {
      format: "cjs",
      file: "dist/datav.map.vue.cjs.js",
      name: "datav"
    },
    plugins: [
      vue(),
      postcss(),
      resolve(),
      babel({
        exclude: "node_modules/**"
      }),
      commonjs()
    ],
    external: ["vue"]
  }
];

