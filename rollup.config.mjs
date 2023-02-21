import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  external: ["leaflet"],
  output: [
    {
      format: "cjs",
      file: "dist/bundle.cjs.js",
      sourcemap: true,
    },
    {
      format: "es",
      file: "dist/bundle.es.js",
      sourcemap: true,
    },
  ],
  plugins: [typescript({ tsconfig: "./tsconfig.json" })],
};
