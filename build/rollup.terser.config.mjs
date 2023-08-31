import resolve from "rollup-plugin-node-resolve";
import vue from "rollup-plugin-vue";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "build/entry.js",
    output: {
      format: "umd",
      file: "dist/datav.vue.min.js",
      name: "datav",
      globals: {
        vue: "Vue",
      },
    },

    plugins: [
      vue({
        preprocessStyles: true,
      }),
      postcss(),
      resolve(),
      babel({
        exclude: "node_modules/**",
      }),
      commonjs(),
      terser(),
    ],
    external: ["vue"],
  },
  {
    input: "build/esm.entry.js",
    output: {
      format: "esm",
      file: "dist/datav.vue.esm.min.js",
      name: "datav",
    },
    plugins: [
      vue({
        preprocessStyles: true,
      }),
      postcss(),
      resolve(),
      babel({
        exclude: "node_modules/**",
      }),
      commonjs(),
      terser(),
    ],
    external: ["vue"],
  },
  {
    input: "build/cjs.entry.js",
    output: {
      format: "cjs",
      file: "dist/datav.vue.cjs.min.js",
      name: "datav",
      exports: "named",
    },
    plugins: [
      vue({
        preprocessStyles: true,
      }),
      postcss(),
      resolve(),
      babel({
        exclude: "node_modules/**",
      }),
      commonjs(),
      terser(),
    ],
    external: ["vue"],
  },
];
