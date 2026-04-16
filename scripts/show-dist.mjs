import { readFileSync } from "node:fs";

console.log("=== dist/index.js ===");
console.log(readFileSync("dist/index.js", "utf8"));
