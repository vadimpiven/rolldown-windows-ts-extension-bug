# Rolldown Windows: `preserveModules` keeps `.ts` source extension in output import specifiers

Minimal reproduction for a cross-platform discrepancy in Rolldown's
`preserveModules: true` + `preserveModulesRoot: "src"` output.

- **Linux / macOS:** `dist/index.js` correctly imports `./helper.js`.
- **Windows:** `dist/index.js` imports `./helper.ts`, causing
  `ERR_MODULE_NOT_FOUND` at runtime — Node's ESM resolver looks for
  `dist/helper.ts` which does not exist (the chunk is emitted as
  `dist/helper.js`).

## Reproduce locally

```sh
npm install
npm run build       # runs rolldown with preserveModules + preserveModulesRoot: "src"
npm run show        # prints dist/index.js
npm run run-dist    # executes the built output via node
```

## Reproduce on CI

`.github/workflows/ci.yml` runs `build` + `show` + `run-dist` on
`ubuntu-latest`, `macos-latest`, and `windows-latest`. The Windows job
is expected to fail at `run-dist` with `ERR_MODULE_NOT_FOUND`.

## Expected `dist/index.js` (observed on macOS / Linux)

```js
import { greet } from "./helper.js";
//#region src/index.ts
console.log(greet("world"));
//#endregion
```

## Actual `dist/index.js` on Windows

```js
import { greet } from "./helper.ts";
...
```

Runtime error:

```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  'C:\...\dist\helper.ts' imported from C:\...\dist\index.js
```

## Environment

- `rolldown` 1.0.0-rc.16
- Node.js 22.x (reproduced on 22.22.2)
- Windows runner: `windows-latest` / `windows-large-amd64`
