import resolve from "rollup-plugin-node-resolve";
import vue from "rollup-plugin-vue";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import postcss from "rollup-plugin-postcss";

export default [
  {
    input: "build/entry.js",
    output: {
      format: "umd",
      file: "dist/datav.map.vue.js",
      name: "datav",
      globals: {
        // vue包: 全局变量名 window.Vue
        vue: "Vue",
      },
    },
    plugins: [
      // rollup-plugin-vue 6.0.0版本 插件必须放在第一,需要postcss插件处理,sfc使用less,需安装less
      vue({
        preprocessStyles: true,
      }),
      resolve(),
      babel({
        exclude: "node_modules/**",
      }),
      commonjs(),
      postcss(),
    ],
    external: ["vue"],
  },
  {
    input: "build/esm.entry.js",
    output: {
      format: "esm",
      file: "dist/datav.map.vue.esm.js",
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
    ],
    external: ["vue"],
  },
  {
    input: "build/cjs.entry.js",
    output: {
      format: "cjs",
      file: "dist/datav.map.vue.cjs.js",
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
    ],
    external: ["vue"],
  },
];
