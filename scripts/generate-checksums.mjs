import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ensureDir, listFiles, ok, pathFromRoot, rel, sha256 } from "./lib/harness.mjs";

const target = process.argv[2] ? pathFromRoot(process.argv[2]) : pathFromRoot("templates");
const outDir = pathFromRoot("dist", "checksums");
const outFile = join(outDir, "SHA256SUMS.txt");

ensureDir(outDir);
const lines = listFiles(target)
  .map((file) => `${sha256(file)}  ${rel(file)}`)
  .sort();

writeFileSync(outFile, `${lines.join("\n")}\n`, "utf8");
ok(`checksums written to ${rel(outFile)}`);

