import { existsSync } from "node:fs";
import { basename, join } from "node:path";
import { copyRecursive, exitWithFailures, ok, pathFromRoot } from "./lib/harness.mjs";

const targetArg = process.argv[2];
if (!targetArg) {
  exitWithFailures(["usage: npm run init:product -- products/my-product"]);
}

const target = pathFromRoot(targetArg);
if (existsSync(target)) {
  exitWithFailures([`target already exists: ${targetArg}`]);
}

copyRecursive(pathFromRoot("templates", "product-starter"), target);
ok(`product starter created at ${targetArg}`);
ok(`next step: cd ${targetArg} && npm install`);
ok(`product name placeholder: ${basename(targetArg)}`);

