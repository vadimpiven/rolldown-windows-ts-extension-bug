import { defineConfig } from "rolldown";

export default defineConfig({
  input: ["./src/index.ts"],
  external: (id, importer, isResolved) => {
    console.log(`[external] id=${JSON.stringify(id)} importer=${JSON.stringify(importer)} isResolved=${isResolved}`);
    return /^[^./]/.test(id);
  },
  output: {
    dir: "dist",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
});
