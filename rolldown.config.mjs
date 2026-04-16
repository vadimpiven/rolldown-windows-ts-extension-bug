import { defineConfig } from "rolldown";

export default defineConfig({
  input: ["./src/index.ts"],
  output: {
    dir: "dist",
    format: "es",
    entryFileNames: (chunkInfo) => `[name].js`,
    preserveModules: true,
    preserveModulesRoot: "src",
  },
});
