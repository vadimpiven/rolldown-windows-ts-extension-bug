import { defineConfig } from "rolldown";

export default defineConfig({
  input: ["./src/index.ts"],

  // external() sees two calls per import:
  //   1. unresolved:  "./helper"
  //   2. resolved:    POSIX    → "/home/.../src/helper.ts"   (starts with '/')
  //                   Windows  → "D:\\...\\src\\helper.ts"   (starts with a drive letter)
  //
  // This regex is meant to match bare specifiers only, but on Windows it also
  // matches the resolved absolute path, so the local file is marked external.
  external: (id) => /^[^./]/.test(id),

  output: {
    dir: "dist",
    format: "es",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
});
