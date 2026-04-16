import { defineConfig } from "rolldown";

export default defineConfig({
  input: ["./src/index.ts"],
  external: (id) => id.startsWith("node:"),
  output: {
    dir: "dist",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
});
