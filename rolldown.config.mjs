import { defineConfig } from "rolldown";

export default defineConfig({
  input: ["./src/index.ts"],

  // Option A: only classify at the unresolved-specifier phase.
  // On the resolved call, Rolldown hands back absolute paths whose shape
  // differs by platform (POSIX "/...", Windows "D:\\..."); classifying
  // those as external is never what the user intends and produces
  // broken imports in preserveModules output.
  external: (id, _importer, isResolved) => !isResolved && /^[^./]/.test(id),

  output: {
    dir: "dist",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
});
