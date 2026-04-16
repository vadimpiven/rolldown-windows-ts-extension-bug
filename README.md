# Rolldown Windows `.ts` extension bug

On Windows, Rolldown 1.0.0-rc.16 silently emits output ESM imports with the
source `.ts` extension when `preserveModules: true` is combined with an
`external()` function that returns `true` for the resolved path. The output
fails at runtime with `ERR_MODULE_NOT_FOUND`. Linux and macOS are unaffected.

## Reproduce

```sh
npm install
npm run build       # rolldown -c
npm start           # node dist/index.js — fails on Windows only
```

`.github/workflows/ci.yml` runs the above on `ubuntu-latest`, `macos-latest`,
and `windows-latest`. Windows fails; the others pass.

## Root cause

Rolldown calls `external()` twice per import: once with the unresolved
specifier (`"./helper"`), then again with the resolved absolute path.
The resolved path shape differs by platform:

- POSIX: `/home/.../src/helper.ts` — starts with `/`
- Windows: `D:\...\src\helper.ts` — starts with a drive letter

The regex `/^[^./]/` in this repro's `external()` is meant to match bare
package specifiers only. On POSIX it correctly excludes absolute paths
(they start with `/`). On Windows the drive letter matches the regex, so
the local file is marked external.

With `preserveModules: true`, Rolldown then emits the import specifier
using the source extension (`./helper.ts`) instead of the output extension
(`./helper.js`), producing a bundle that cannot load at runtime.

## Observed output

`dist/index.js` on Linux / macOS:

```js
import { greet } from "./helper.js";
console.log(greet("world"));
```

`dist/index.js` on Windows:

```js
import { greet } from "./helper.ts";
console.log(greet("world"));
```

Windows runtime error:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  'D:\a\...\dist\helper.ts' imported from D:\a\...\dist\index.js
```

## Environment

- `rolldown` 1.0.0-rc.16 (latest)
- Node.js 22 (`windows-latest` runner)
