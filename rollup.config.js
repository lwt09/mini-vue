import pkg from "./package.json";

import typescript from "@rollup/plugin-typescript";
export default {
  input: "./src/index.ts",
  output: [
    // 1. cjs -> 打包成common js
    // 2. esm -> 打包成es module
    {
      format: "cjs",
      file: pkg.module,
    },
    {
      format: "es",
      file: pkg.main,
    },
  ],
  plugins: [typescript()],
};
