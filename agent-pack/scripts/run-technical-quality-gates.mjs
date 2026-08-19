import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packRoot = path.resolve(scriptDir, "..");
const configPath = path.join(packRoot, "quality", "technical-quality-commands.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const repositoryRoot = path.resolve(path.dirname(configPath), config.repositoryRoot);
const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyIndex = args.indexOf("--only");
const requested = onlyIndex >= 0 ? new Set((args[onlyIndex + 1] ?? "").split(",").filter(Boolean)) : null;

if (onlyIndex >= 0 && !args[onlyIndex + 1]) {
  console.error("--only requires a comma-separated list of command IDs");
  process.exit(2);
}

const selected = requested ? config.commands.filter((item) => requested.has(item.id)) : config.commands;
if (requested && selected.length !== requested.size) {
  const known = new Set(config.commands.map((item) => item.id));
  const unknown = [...requested].filter((id) => !known.has(id));
  console.error(`Unknown command ID(s): ${unknown.join(", ")}`);
  process.exit(2);
}

console.log("Technical quality evidence only. This runner cannot accept a product gate, QA verdict, release, or later sprint.");
console.log(`Repository root: ${repositoryRoot}`);
let failed = false;
for (const item of selected) {
  console.log(`\n[${item.id}] ${item.description}\n$ ${item.command}`);
  if (dryRun) continue;
  const result = spawnSync(item.command, { cwd: repositoryRoot, shell: true, stdio: "inherit" });
  if (result.status !== 0) {
    failed = true;
    console.error(`[${item.id}] failed with exit code ${result.status ?? "unknown"}`);
  }
}
process.exit(failed ? 1 : 0);
