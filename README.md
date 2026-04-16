# Rolldown Windows `.ts` extension bug

With `preserveModules: true`, Rolldown 1.0.0-rc.16 on Windows emits output
ESM imports that keep the source `.ts` extension instead of the emitted
`.js` extension. The output fails at runtime with `ERR_MODULE_NOT_FOUND`.
Linux and macOS are unaffected.

## Reproduce

```sh
npm install
npm run build       # rolldown with preserveModules
npm start           # node dist/index.js — fails on Windows only
```

`.github/workflows/ci.yml` runs the above on `ubuntu-latest`,
`macos-latest`, and `windows-latest`. Windows fails; the others pass.

## Observed output

`dist/index.js` on Linux / macOS:

```js
import { greet } from "./helper.js";
```

`dist/index.js` on Windows:

```js
import { greet } from "./helper.ts";
```

Windows runtime error:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find module
  'D:\a\...\dist\helper.ts' imported from D:\a\...\dist\index.js
```

## Environment

- `rolldown` 1.0.0-rc.16 (latest)
- Node.js 24 (`windows-latest` runner)
